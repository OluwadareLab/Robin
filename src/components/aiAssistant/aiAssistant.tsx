import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import OpenAI from 'openai';
import Markdown from 'https://esm.sh/react-markdown@9'
import { TempJyupterUploader } from '../tempJuypterParser/tempJuypterPopup';
import axios from 'axios';
import { apiPaths } from '../../api/apiConfig';
import { useParams } from 'react-router-dom';
import config from '../../config.mjs';
import { InstructionHeader } from '../misc/instructionHeader';


//TODO hide key
const openai = new OpenAI({
  apiKey: 'sk-proj-Rl8bDKXjiHPR9qJvYWg4T3BlbkFJrhEodKLfVSSnqOHr3lkR', // This is the default and can be omitted
  dangerouslyAllowBrowser: true,
});

type AiAssistantComponentProps = {
  datasets: any[];
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
  height: "1800px",
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
      datasets: {},
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
      dataObj.datasets = tempDatasets;
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
      "source": ${JSON.stringify(codeSnippet.split("\n").filter(line => line.length > 1).map(line => line += "\n"))}
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
/** @description the main function to get a response from gpt */
async function getResponseFromGPT(msg: string, id): string {
  const avaliblePythonModules = ["matplotlib"]
  const dataSets = await setupDataSets(id);
  console.log(dataSets)
  dataSets.raw=undefined;
  //{
  //   "dogs":[{"age":10,"name":"tucker"},{"age":14,"name":"barky"},{"age":18,"name":"pupper"},{"age":5,"name":"waggle"},{"age":7,"name":"oatmeal"}]
  // };
  const context = `
    Any code generated MUST be in pythong in the format \`\`\`python \`\`\`
    you may only use the following python modules in your responses, do not use any not included in this list: ${JSON.stringify(avaliblePythonModules)}
    When writing code do not attempt to do any calculations yourself, write code to do all calculations.
    the following question partains to data visualization in the context of chromatin loop analysis.
    the following datasets should be used to answer the question.
    Datasets: ${JSON.stringify(dataSets)}

  `;

  const actualMsg = context + msg;

  console.log(actualMsg);

  const regexCodeSnippetMatcher = /\`\`\`python(.*?)\`\`\`/s
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: actualMsg }],
    model: "gpt-3.5-turbo",
  });
  const answer = completion.choices[0].message.content;
  const regexMatch = regexCodeSnippetMatcher.exec(answer);
  if (regexMatch) {
    const codeSnippet = regexMatch[1];
    console.log(answer);
    console.log(codeSnippet);
    const juypterFile = juypterFileAsembler(codeSnippet);
    console.log(juypterFile);

    if (codeSnippet) {
      const formData = new FormData();
      formData.append(`id`, id.toString());
      // Convert the string to a Blob
      const blob = new Blob([juypterFile], { type: 'text/plain' });

      // Create a File object from the Blob
      const fileName = "example.txt";
      const file = new File([blob], fileName, { type: 'text/plain' });
      formData.append(`files`, file, `${msg.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9]/g, '')}.ipynb`);
      axios.post(apiPaths.jyupterUpload, formData);
    }
  }
  return answer;
}

function ChatInterface(props) {
  const params = useParams();
  const jobId = params.id || 1;
  const {messages, setMessages} = props;
  const [inputText, setInputText] = useState<string>('');
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File>();
  

  const handleSubmit = async (event) => {
    let newMsgs: msg[] = [...messages];

    event.preventDefault();
    if (inputText.trim()) {
      //add our msg to the log
      newMsgs = [...newMsgs, { text: inputText, sender: 'user' }];
      setMessages(newMsgs);
      //clear log
      setInputText('');

      //get response from gpt
      newMsgs = [...newMsgs, { text: await getResponseFromGPT(inputText, jobId), sender: 'bot' }];
      setMessages(newMsgs);
    }
  };

  return (
    <Container className="my-3" style={chatContainerStyle}>
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Body>
              <div style={{ overflowY: 'auto' }}>
                {messages.map((message, index) => (
                  <div key={index} className={`mb-2 text-${message.sender === 'user' ? 'right' : 'left'}`}>
                    <Card.Text className={`p-2 bg-${message.sender === 'user' ? 'primary' : 'secondary'} text-white rounded`}>
                      <Markdown>{message.text}</Markdown>
                    </Card.Text>
                  </div>
                ))}
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

    </Container>
  );
}

export default ChatInterface;
let k = 0;
export function AiAssistantComponent(props: AiAssistantComponentProps) {
  const params = useParams();
  const jobId = params.id || 1;
  const [messages, setMessages] = useState<msg[]>([]);
  const [htmlFiles, setHtmlFiles] = useState<string[]>([]);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  let timer = 0;
  setInterval(()=>{
    timer++;
  },10000)

  useEffect(() => {
    axios.get(apiPaths.htmlFiles + "?id=" + jobId).then((response) => {
      console.log(response)
      if(response.data.files)
        if(response.data.files.length>0)
          setHtmlFiles([...response.data.files]);
      setForceUpdate(k += 3 * 2);
    });
  }, [messages,timer])

  return (
    <>
    <Row>
      <Col>
      <InstructionHeader title='An AI Assistant for data visualization'/>
      <p>You may ask the AI to generate additional graphs and data visualizations for your data, it will write code that will execute and draw graphs from the data.
        Keep in mind Large Language models do not particularly "know" what they are saying and often do not hold much regard for truth. Make sure to double check any result produced by the AI.
        <hr/>
        When prompting, be specific as to what you want and what data you want it to use. It has acsess to all data assosiated with your job.
        <hr/>
        DO NOT: tell the AI to write in a langauge other than python or tell it to use specific packages, it only has access to a few predownloaded packages.
        <hr/>
        An easy way to test this tool is to ask it to generate a graph we have already properly created, for instance "Please generate a line graph of loop size compared to resolution"
      </p>
      <ChatInterface 
        messages={messages}
        setMessages={setMessages}
      />
      </Col>
      <Col>
      <InstructionHeader title='results will display here:'/>
      <p>All produced results will be saved with your job. And remain avalible in this tab alongside their source code for you to copy if you would like to reproduce the results. Note that the AI should always put the raw data directly into the script to ensure they are self contained and can be reproduced anywhere. </p>
      {htmlFiles.map(file => {
        return (<div key={k++}>
          <div dangerouslySetInnerHTML={{ __html: file }} />
        </div>)
      })
      }
      </Col>
    
    </Row>
      
      
    </>)
}