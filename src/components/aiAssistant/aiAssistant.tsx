import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Collapse, Accordion, AccordionBody, NavLink, AccordionItem } from 'react-bootstrap';
import OpenAI from 'openai';
import Markdown from 'react-markdown';
import { TempJyupterUploader } from '../tempJuypterParser/tempJuypterPopup';
import axios from 'axios';
import { apiPaths } from '../../api/apiConfig';
import { useParams } from 'react-router-dom';
import config from '../../config.mjs';
import { InstructionHeader } from '../misc/instructionHeader';
import Select from 'react-select'
import { UTIL } from '../../util';
import { CustomLegendWithSelection } from '../graph/CustomLegend';
import { resultData } from '../tempTypes/Types';

import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { AiInstructions } from './aiInstructions';
import { BtnLink } from '../buttons/BtnLink';

//import style sheet
import "./aiAssistant.css"

type AiAssistantComponentProps = {
  datasets: any[];
  clrs: any[]
}

type msg = {
  text: string,
  sender: string
}

/** the style obj for the chat container */
const chatContainerStyle = {
  backgroundColor: "#424242", /* Light grey background for the overall chat container */
  borderRadius: "8px", /* Rounded corners for a modern look */
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", /* Subtle shadow for depth */
  overflow: "overflow: scroll;", /* Ensures no overflow outside the rounded corners */
  height: "auto",
  display: "flex",
  flexDirection: "column", /* Ensures a column layout for messages and input area */
}

const msgBoxStyle = {
  position: "fixed",
  bottom: "0px",
  width: "100%"
}

/**
 * @description get all data from a job and format it into a inteligable and sorted object
 * @param jobId the id of the job
 * @returns 
 */
export function setupDataSets(jobId: number): Promise<resultData> {
  return new Promise(res => {
    const dataObj = {
      recoveryDatasets: {},
      remData: [],
      loopSizes: {},
      regressionPoints: {},
      kbVsRes: {},
      binVsRes: {},
      binVsResVsKbVsResDataset: {},
      overlapData: [],
      higlassUids: [],
      raw: {}
    }
    axios.get(apiPaths.jobResults + "?id=" + jobId).then(async (response) => {
      console.log("-------------------------all results data-------------------------")
      console.log(response);
      if (config.DEBUG) console.log(response.data);

      dataObj.overlapData = response.data.overlapData;
      dataObj.higlassUids = response.data.tilesetUids;
      dataObj.raw = response.data.results;

      const results = response.data.results;
      if (config.DEBUG) console.log(results)

      function convertToXYDataset(str: string) {
        return str.split("\n").map(line => {
          const splitLine = line.split(/\s+/);
          return (
            {
              "x": parseFloat(splitLine[0]),
              "y": parseFloat(splitLine[1])
            }
          )
        })
      }

      //clear all datasets as we update
      let tempDatasets: any = {}
      let tempRemData: any[] = [];
      let tempLoopSizes: any = {};
      let tempRegressionPoints: any = {}
      let tempKbVsRes: any = {};
      let tempBinVsRes: any = {};
      let tempBinVsResVsKbVsResDataset: any = {};

      const toolsNames = Object.keys(results);
      toolsNames.forEach(name => {
        const toolData: {
          ctcfResults: { data: any }[],
          h3k27acResults: { data: any }[],
          remResults: { data: any }[],
          rnapiiResults: { data: any }[],
          toolName: string
        } = results[name];


        toolData.results.map(result => result.data = convertToXYDataset(result.data));
        if (config.DEBUG) console.log(toolData)

        //append all datasets
        toolData.results.forEach(obj => {
          if (!tempDatasets[obj.method]) tempDatasets[obj.method] = [];
          tempDatasets[obj.method].push(obj);
        })

        toolData.loopSizeResults.forEach(obj => {
          if (!tempLoopSizes[obj.toolName]) tempLoopSizes[obj.toolName] = [];
          tempLoopSizes[obj.toolName].push(obj);
        })

        tempRemData = [...tempRemData, ...toolData.remResults];
        if (config.DEBUG) console.log(toolData)

        //if we have enough points to plot our regression
        // if(tempLoopSizes[obj.method].length > 1){
        let obj = toolData.results[0] || toolData.loopSizeResults[0] || toolData.remResults[0];
        if (config.DEBUG) console.log(obj)
        console.log("-------------------firstObj----------------------")
        console.log(obj);
        if (obj) {

          tempRegressionPoints[obj.toolName] = {
            'kbVsRes': [],
            'binVsRes': []
          };

          if (!tempLoopSizes[obj.toolName]) tempLoopSizes[obj.toolName] = [];
          tempLoopSizes[obj.toolName].forEach(loopSizeInfo => {
            tempRegressionPoints[obj.toolName]['kbVsRes'].push({ x: parseInt(loopSizeInfo.resolution), y: parseFloat(loopSizeInfo.avgKbSize) })
            tempRegressionPoints[obj.toolName]['binVsRes'].push({ x: parseInt(loopSizeInfo.resolution), y: parseFloat(loopSizeInfo.avgBinNumersSize) })
          })

          //extract the data
          tempKbVsRes[obj.toolName] = []
          tempRegressionPoints[obj.toolName]['kbVsRes'].forEach(kbVsResElement => {
            tempKbVsRes[obj.toolName].push(kbVsResElement);
          })
          tempBinVsRes[obj.toolName] = []
          tempRegressionPoints[obj.toolName]['binVsRes'].forEach(binVsResElement => {
            tempBinVsRes[obj.toolName].push(binVsResElement);
          })

          console.log("---------------regression--------------")
          console.log(tempKbVsRes)
          console.log(tempBinVsRes)
          console.log(tempLoopSizes)


          tempBinVsResVsKbVsResDataset[obj.toolName] = [];
          for (let index = 0; index < tempBinVsRes[obj.toolName].length; index++) {
            const binVsResElement = tempBinVsRes[obj.toolName][index];
            const kbVsResElement = tempKbVsRes[obj.toolName][index];
            tempBinVsResVsKbVsResDataset[obj.toolName].push({
              y: (kbVsResElement.y / kbVsResElement.x),
              x: (binVsResElement.y / binVsResElement.x)
            })
          }

          tempBinVsRes[obj.toolName] = tempBinVsRes[obj.toolName].sort((a, b) => {
            return (a.x - b.x)
          });
          tempKbVsRes[obj.toolName] = tempKbVsRes[obj.toolName].sort((a, b) => {
            return (a.x - b.x)
          });

          tempBinVsResVsKbVsResDataset[obj.toolName] = tempBinVsResVsKbVsResDataset[obj.toolName].sort((a, b) => {
            return (a.x - b.x)
          });

          let obj2 = {}
          obj2.data = tempBinVsResVsKbVsResDataset[obj.toolName];
          obj2.category = obj.category;
          tempBinVsResVsKbVsResDataset[obj.toolName] = obj2;

          if (config.DEBUG) console.log(tempKbVsRes)
          if (config.DEBUG) console.log(tempBinVsResVsKbVsResDataset)

          dataObj.binVsRes = tempBinVsRes
          dataObj.kbVsRes = tempKbVsRes
          dataObj.binVsResVsKbVsResDataset = tempBinVsResVsKbVsResDataset
        }

      })



      if (config.DEBUG) console.log(tempDatasets)
      dataObj.recoveryDatasets = tempDatasets;
      dataObj.remData = tempRemData;
      dataObj.loopSizes = tempLoopSizes;
      dataObj.regressionPoints = tempRegressionPoints
      if (config.DEBUG) console.log(tempRegressionPoints)
      if (config.DEBUG) console.log(tempLoopSizes)
      res(dataObj);
    });
  })

}

function juypterFileAsembler(codeSnippet) {
  const partial = `
  {
    "cells": [
     {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": ${JSON.stringify(codeSnippet.split("\n").filter(line => line.length >= 1).map(line => line += "\n"))}
     }
    ],
    "metadata": {
     "kernelspec": {
      "display_name": "Python 3",
      "language": "python",
      "name": "python3"
     },
     "language_info": {
      "codemirror_mode": {
       "name": "ipython",
       "version": 3
      },
      "file_extension": ".py",
      "mimetype": "text/x-python",
      "name": "python",
      "nbconvert_exporter": "python",
      "pygments_lexer": "ipython3",
      "version": "3.7.6"
     },
     "toc": {
      "base_numbering": 1,
      "nav_menu": {},
      "number_sections": false,
      "sideBar": true,
      "skip_h1_title": false,
      "title_cell": "Table of Contents",
      "title_sidebar": "Contents",
      "toc_cell": false,
      "toc_position": {},
      "toc_section_display": true,
      "toc_window_display": false
     }
    },
    "nbformat": 4,
    "nbformat_minor": 4
   }   
  `

  return partial;
}


let i = 0;

function extractSnippetFromMarkdownText(text) {
  const regexCodeSnippetMatcher = /\`\`\`python(.*?)\`\`\`/s
  const regexMatch = regexCodeSnippetMatcher.exec(text);
  return regexMatch[1];
}

function submitSnippet(answer, jobId, jobTitle) {
  const regexCodeSnippetMatcher = /\`\`\`python(.*?)\`\`\`/s
  const regexMatch = regexCodeSnippetMatcher.exec(answer);
  if (regexMatch) {
    const codeSnippet = regexMatch[1];
    console.log(answer);
    console.log(codeSnippet);
    const juypterFile = juypterFileAsembler(codeSnippet);
    console.log(juypterFile);

    if (codeSnippet) {
      const formData = new FormData();
      formData.append(`id`, jobId.toString());
      // Convert the string to a Blob
      const blob = new Blob([juypterFile], { type: 'text/plain' });

      // Create a File object from the Blob
      const fileName = "example.txt";
      const file = new File([blob], fileName, { type: 'text/plain' });
      formData.append(`files`, file, `${jobTitle.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9]/g, '_')}.ipynb`);
      axios.post(apiPaths.jyupterUpload, formData);
    }
  }
}

type MessageContainerProps = {
  /**the response from the ai */
  message: string;
  /** what they werwe reponding to */
  question: string;

  /** a variable that will change to signifty that a result has been saved */
  updater:any
}
/**
 * 
 * @param props 
 * @returns 
 */
const MessageContainer = (props: MessageContainerProps) => {
  const params = useParams();
  const [isEditMode, setEditMode] = useState<boolean>(true);
  const [message, setMessage] = useState(props.message);
  const [output, setOutput] = useState("");
  const [hasCodeBeenTested, setCodeHasBeenTested] = useState<boolean>(false);
  const [waitingForResponse, setWaitingForResponse] = useState<boolean>(false);
  const [waitingForJyupterResponse, setWaitingForJyupterResponse] = useState<boolean>(false);

  //run code using flask
  const runCode = async (msg) => {
    try {
      const response = await axios.post(`${config.flaskAPIUrl}run`, { code: msg }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('Error running code:' + error);
    }
  };

  useEffect(() => {
    setWaitingForResponse(false);
  }, [output]);

  useEffect(() => {
    setWaitingForJyupterResponse(false);
  }, [props.updater]);

  return <>
    <CodeMirror
      value={message}
      height="400px"
      extensions={[python()]}
      theme={oneDark}
      onChange={(value) => setMessage(value)}
    />
    {
      (waitingForResponse || waitingForJyupterResponse) ?
        <div className="loader">
          <span>.</span><span>.</span><span>.</span>
        </div>
        : ""
    }
    <pre style={{ color: "black" }}>{output}</pre>
    <Row>
      <Col>
        <Button onClick={() => {
          if(waitingForResponse) {alert("Please wait for response"); return;}
          runCode(extractSnippetFromMarkdownText(message))
          setCodeHasBeenTested(true);
          setWaitingForResponse(true);
        }}>Test Code</Button>
      </Col>
      <Col>
        <Button variant={hasCodeBeenTested ? "primary" : "secondary"} onClick={() => {
          //user must test code first
          if (hasCodeBeenTested) {
            if(waitingForJyupterResponse) {alert("Please wait for response. The list on the right will update with your result"); return;}
            submitSnippet(message, params.id, props.question)
            setWaitingForJyupterResponse(true);
          } else {
            alert("you must test your code before saving it.");
          }

        }}>Run Code & Save Result</Button>
      </Col>
    </Row>

  </>


}

function ChatInterface(props) {
  const params = useParams();
  const jobId = params.id || 1;
  const { messages, setMessages } = props;
  const [inputText, setInputText] = useState<string>('');
  const [name, setName] = useState<string>("");
  const [apikey, setApiKey] = useState<string>("");

  //used to wait for the ai to respond
  const [timeUserLastSpoke, setTimeUserLastSpoke] = useState<number>(0);
  const [userCanSpeak, setUserCanSpeak] = useState<boolean>(true);

  const [file, setFile] = useState<File>();

  const models = [
    { label: "gpt-3.5-turbo", value: "gpt-3.5-turbo" },
    { label: "gpt-4-turbo", value: "gpt-4-turbo" },
    { label: "gpt-4", value: "gpt-4" },
    { label: "gpt-4-32k", value: "gpt-4-32k" },
  ]

  const [model, setModel] = useState<string>(models[0].value);
  const [dataSets, setDataSets] = useState({});
  const [customLegendWithSelectionState, setCustomLegendWithSelectionState] = useState({});

  //TODO hide key
  let openai = new OpenAI({
    apiKey: apikey, // This is the default and can be omitted
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    setupDataSets(jobId).then(dataSets => { delete dataSets["raw"]; delete dataSets["higlassUids"]; setDataSets(dataSets) });
  }, [])

  useEffect(() => {
    openai = new OpenAI({
      apiKey: apikey, // This is the default and can be omitted
      dangerouslyAllowBrowser: true,
    });
  }, [apikey])



  /** @description the main function to get a response from gpt */
  async function getResponseFromGPT(msg: string, id): string {
    try {
      const avaliblePythonModules = ["matplotlib"]
      const filteredDatasets = Object.keys(dataSets).filter(key => {
        console.log("key:" + key);
        console.log(customLegendWithSelectionState);
        return customLegendWithSelectionState[key];
      }).map(key => dataSets[key]);



      //{
      //   "dogs":[{"age":10,"name":"tucker"},{"age":14,"name":"barky"},{"age":18,"name":"pupper"},{"age":5,"name":"waggle"},{"age":7,"name":"oatmeal"}]
      // };
      const context = `
      Any code generated MUST be in pythong in the format \`\`\`python \`\`\`
      you may only use the following python modules in your responses, do not use any not included in this list: ${JSON.stringify(avaliblePythonModules)}
      When writing code do not attempt to do any calculations yourself, write code to do all calculations.
      the following question partains to data visualization in the context of chromatin loop analysis.
      Prioritize functional code above all else. do not explain your code unless asked to, still comment it though.
      Below is a JSON object containing all data applicable to this question:
      ${JSON.stringify(filteredDatasets)}
      Always use the above data, do not make up data or infer data. Always finish your code, do not leave places for the user to put in data, use the data provided above.
      Never abriviate the data, never try to save space. ALWAYS INCLUDE FULL DATA.

    `;

      const actualMsg = context + msg;

      console.log(actualMsg);

      console.log(model);
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: actualMsg }],
        model: model.value,
      });

      const answer = completion.choices[0].message.content;
      return answer;
    } catch (error) {
      console.log("err getting ai response :(");
      console.log(error);
      return `the following error occured: ${error}`;
    }

  }


  /** @description handle when the user submits a message to the ai */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userCanSpeak) {
      if (!window.confirm("Please wait until the ai responds to you for best results, hit okay to ignore this advice, cancel to cancel this message")) return "";
    }

    let newMsgs: msg[] = [...messages];

    //record last tiem the user spoke to make sure they have to wait till ai responds
    setTimeUserLastSpoke(Date.now());
    setUserCanSpeak(false);

    
    if (inputText.trim()) {
      //add our msg to the log
      newMsgs = [...newMsgs, { text: inputText, sender: 'user', question: inputText }];
      setMessages(newMsgs);
      //clear log
      setInputText('');

      //get response from gpt
      newMsgs = [...newMsgs, { text: await getResponseFromGPT(inputText, jobId), sender: 'bot', question: inputText }];
      setMessages(newMsgs);
      setUserCanSpeak(true);
    }
  };

  function updateSelection(data) {
    setCustomLegendWithSelectionState(data);
  }

  let k = 0;
  return (
    <>
      <Row md={8}>
        <InstructionHeader title='please enter your openai api key below.' />
        <p>Your API key is never cached or stored in anyway on our servers, the second you close this tab it is gone.</p>
        <p>Dont have a key? get one: <BtnLink src="https://www.maisieai.com/help/how-to-get-an-openai-api-key-for-chatgpt" title='here' /></p>
        <label htmlFor='apikeyInput'>OpenAI API key:</label>
        <input id="apikeyInput"
          value={apikey}
          onChange={(e) => setApiKey(e.target.value)}
          type="text"
        >
        </input>
        <label htmlFor='modelSelect'>Select AI Model:</label>
        <Select
          id="modelSelect"
          name="modelSelector"
          options={models}
          value={model}
          className="onTop"
          onChange={(val, other) => setModel(val)}
        />
      </Row>
      <Row md={8}>
        <InstructionHeader title="select what parts of the job's data your question pertains to." />
        <CustomLegendWithSelection
          max={50}
          state={customLegendWithSelectionState}
          setState={setCustomLegendWithSelectionState}
          items={
            Object.keys(dataSets).map(name => ({
              "label": name,
              "backgroundColor": props.clrs[k++]
            }))
          }
          onSelect={updateSelection}
        />
      </Row>
      <Container className="my-3">
        <Row>
          <Col className="mx-auto">
            <Card>
              <Card.Body>
                <div style={{ overflowY: 'auto' }}>
                  {messages.map((message, index) => (
                    <div key={index} className={`mb-2 text-${message.sender === 'user' ? 'right' : 'left'}`}>
                      <Card.Text className={`p-2 bg-${message.sender === 'user' ? 'primary' : 'secondary'} text-white rounded`}>
                        {message.sender === 'user' ?
                          <Markdown>{message.text}</Markdown>
                          : <MessageContainer
                            updater={props.updater}
                            message={message.text}
                            question={message.question}
                          />}

                      </Card.Text>
                    </div>
                  ))}
                  {/** show loading dots when the ai is thinking */}
                  {userCanSpeak ? "" :
                  <Card.Text className={`p-2 bg-secondary`}>
                    <div className="loader"/>
                     </Card.Text>
                 }
              </div>
              <Row>
                <Form onSubmit={handleSubmit} >
                  <Form.Group className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Type your message here..."
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                    />
                    <Button variant="primary" type="submit">Send</Button>
                  </Form.Group>
                </Form>
              </Row>

            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* <TempJyupterUploader
        fileName={name} setFileName={setName} file={file} setFile={setFile} /> */}

    </Container >
    </>
  );
}

export default ChatInterface;
let k = 0;
export function AiAssistantComponent(props: AiAssistantComponentProps) {
  const params = useParams();
  const jobId = params.id || 1;
  const [messages, setMessages] = useState<msg[]>([]);
  const [htmlFiles, setHtmlFiles] = useState<{ file: string, name: string, open:boolean, key:string }[]>([]);
  const [forceUpdate, setForceUpdate] = useState<number>(0);
  const [accodianCtrl, setAccodianCtrl] = useState<string[]>([])

  const [ticking, setTicking] = useState(true),
        [count, setCount] = useState(0)
   
   useEffect(() => {
    const timer = setTimeout(() => ticking && setCount(count+1), 1e4)
    return () => clearTimeout(timer)
   }, [count, ticking])

  useEffect(() => {
    setTimeout(() => {
      axios.get(apiPaths.htmlFiles + "?id=" + jobId).then((response) => {
        console.log(response)
        if (response.data.files)
          if (response.data.files.length > 0){
            let l = 0;
            const newFiles = [
              ...response.data.files.map(fileObj=>(
              {...fileObj,
                key:l.toString(),
                open:!(htmlFiles.map(obj=>obj.name)).includes(fileObj.name),
                temp:l++
              }))
            ]
            setHtmlFiles(newFiles);
            console.log(htmlFiles)
            newFiles.filter(fileObj=>fileObj.open).forEach(obj=>handleSelect(obj.key))
            setForceUpdate(k += 3 * 2);
          }
            
        
      });
      
    }, 5000);
  }, [count, messages])

  const handleSelect = (eventKey) => {
    console.log("selected" + eventKey)
    const currentIndex = accodianCtrl.indexOf(eventKey);
    const newActiveKeys = [...accodianCtrl];

    if (currentIndex === -1) {
      newActiveKeys.push(eventKey);
    } else {
      newActiveKeys.splice(currentIndex, 1);
    }

    setAccodianCtrl(newActiveKeys);
  };

  let j = 0;
  return (
    <Container>
      <Row>
        <Col md={6}>
          <AiInstructions />
          <ChatInterface
            clrs={props.clrs}
            messages={messages}
            setMessages={setMessages}
            updater={accodianCtrl}
          />
        </Col>
        <Col md={6}>
          <InstructionHeader title='results will display here:' />
          <p>All produced results will be saved with your job. And remain avalible in this tab alongside their source code for you to copy if you would like to reproduce the results. Note that the AI should always put the raw data directly into the script to ensure they are self contained and can be reproduced anywhere. </p>
          {htmlFiles.map(file => {
            return (<div key={j++}>
              <Accordion defaultActiveKey={accodianCtrl} activeKey={accodianCtrl} onSelect={handleSelect}>
                <AccordionItem eventKey={`${file.key}`}>
                  <Accordion.Header>{file.name.replace(/_/g, " ").replace(".html","")}</Accordion.Header>
                  <AccordionBody>
                    <div dangerouslySetInnerHTML={{ __html: file.file }} />
                  </AccordionBody>
                </AccordionItem>
              </Accordion>
            </div>)
          })
          }
        </Col>
      </Row>


    </Container>)
}