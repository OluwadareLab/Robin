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
  /** @description wether to disable all edit mode on this page */
  demo: boolean;
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
    }).catch(err => console.log("axios err:" + err));
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
      axios.post(apiPaths.jyupterUpload, formData).catch(err => console.log("axios err:" + err));;
    }
  }
}

type MessageContainerProps = {
  /**the response from the ai */
  message: string;
  /** what they werwe reponding to */
  question: string;

  /** a variable that will change to signifty that a result has been saved */
  updater: any
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
          if (waitingForResponse) { alert("Please wait for response"); return; }
          runCode(extractSnippetFromMarkdownText(message))
          setCodeHasBeenTested(true);
          setWaitingForResponse(true);
        }}>Test Code</Button>
      </Col>
      <Col>
        <Button variant={hasCodeBeenTested ? "primary" : "secondary"} onClick={() => {
          //user must test code first
          if (hasCodeBeenTested) {
            if (waitingForJyupterResponse) { alert("Please wait for response. The list on the right will update with your result"); return; }
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
  const jobId = params.id || config.exampleJobId || 1;
  const { messages, setMessages } = props;
  const [inputText, setInputText] = useState<string>('');
  const [name, setName] = useState<string>("");
  const [apikey, setApiKey] = useState<string>("");

  //used to wait for the ai to respond
  const [timeUserLastSpoke, setTimeUserLastSpoke] = useState<number>(0);
  const [userCanSpeak, setUserCanSpeak] = useState<boolean>(true);

  const [file, setFile] = useState<File>();

  // State for models
  const [models, setModels] = useState<{ label: string; value: string }[]>([]);
  const [model, setModel] = useState<{ label: string; value: string } | null>(null);
  const [loadingModels, setLoadingModels] = useState<boolean>(false);
  const [modelError, setModelError] = useState<string>("");

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

  // Fetch available models when API key changes
  useEffect(() => {
    const fetchModels = async () => {
      if (!apikey || apikey.trim() === "") {
        setModels([]);
        setModel(null);
        setModelError("");
        return;
      }

      setLoadingModels(true);
      setModelError("");

      try {
        const tempOpenai = new OpenAI({
          apiKey: apikey,
          dangerouslyAllowBrowser: true,
        });

        const response = await tempOpenai.models.list();

        // Filter for GPT models and sort them
        const gptModels = response.data
          .filter(model => model.id.startsWith('gpt-'))
          .sort((a, b) => {
            // Prioritize GPT-4 models, then by name
            if (a.id.startsWith('gpt-4') && !b.id.startsWith('gpt-4')) return -1;
            if (!a.id.startsWith('gpt-4') && b.id.startsWith('gpt-4')) return 1;
            return a.id.localeCompare(b.id);
          })
          .map(model => ({
            label: model.id,
            value: model.id
          }));

        if (gptModels.length > 0) {
          setModels(gptModels);
          // Set the first model as default (usually the best/latest one)
          setModel(gptModels[0]);
        } else {
          setModels([]);
          setModel(null);
          setModelError("No GPT models found for this API key");
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        setModels([]);
        setModel(null);
        setModelError("Failed to fetch models. Please check your API key.");
      } finally {
        setLoadingModels(false);
      }
    };

    // Add a small delay to avoid too many API calls while typing
    const timeoutId = setTimeout(fetchModels, 500);
    return () => clearTimeout(timeoutId);
  }, [apikey]);



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
        <p>Dont have a key? get one: <BtnLink target="_blank" src="https://www.maisieai.com/help/how-to-get-an-openai-api-key-for-chatgpt" title='here' /></p>
        <label htmlFor='apikeyInput'>OpenAI API key:</label>
        <input id="apikeyInput"
          value={apikey}
          onChange={(e) => setApiKey(e.target.value)}
          type="text"
          placeholder="Enter your OpenAI API key..."
        >
        </input>
        <label htmlFor='modelSelect'>Select AI Model:</label>
        {loadingModels && <p style={{ color: '#666', fontSize: '0.9em' }}>Loading available models...</p>}
        {modelError && <p style={{ color: 'red', fontSize: '0.9em' }}>{modelError}</p>}
        <Select
          id="modelSelect"
          name="modelSelector"
          options={models}
          value={model}
          className="onTop"
          onChange={(val, other) => setModel(val)}
          isDisabled={loadingModels || models.length === 0}
          placeholder={loadingModels ? "Loading models..." : models.length === 0 ? "Enter API key to load models" : "Select a model..."}
        />
      </Row>
      <Row md={8} className="align-items-center">
        <Col>
          <InstructionHeader title="select what part of the job's data your question pertains to." />
          <CustomLegendWithSelection
            max={50}
            state={customLegendWithSelectionState}
            setState={setCustomLegendWithSelectionState}
            items={
              // use idx instead of global k to avoid mutation issues
              Object.keys(dataSets).map((name, idx) => ({
                label: name,
                backgroundColor: props.clrs[idx % props.clrs.length],
              }))
            }
            max={1}
            onSelect={updateSelection}
          />
        </Col>
        <Col xs="auto" style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="outline-primary"
            size="sm"
            style={{
              transition: "none",
              backgroundColor: "#0d6efd",
              color: "#fff",
              borderColor: "#0d6efd",
              cursor: "pointer",
            }}
            onClick={() => {
              try {
                const datasetNames = Object.keys(dataSets || {});
                const selectedNames = datasetNames.filter(
                  (name) => !!customLegendWithSelectionState[name]
                );

                if (!selectedNames || selectedNames.length === 0) {
                  alert("Please select at least one dataset from the legend first.");
                  return;
                }

                // --- Helper: sanitize strings, decode unicode, and format overlap data ---
                const sanitizeContent = (value: any): any => {
                  if (typeof value === "string") {
                    // Check if this is overlap data format (CSV-like string)
                    if (value.includes('"..set.."') || value.match(/"(\d+)","([^"]+)","([^"]+)","([^"]+)"/)) {
                      // Parse CSV-like string data into structured array
                      const lines = value.split('\n').filter(line => line.trim());
                      const parsedData = [];

                      for (let i = 0; i < lines.length; i++) {
                        // Match pattern: "index","set_expression","count","percentage"
                        const match = lines[i].match(/"(\d+)","([^"]+)","([^"]+)","([^"]+)"/);
                        if (match) {
                          // Clean and preserve all Unicode set operation symbols
                          const setExpression = match[2]
                            .replace(/<U\+2229>/g, '∩')  // intersection
                            .replace(/<U\+2216>/g, '∖')  // set difference
                            .replace(/<U\+222A>/g, '∪'); // union

                          parsedData.push({
                            index: parseInt(match[1]),
                            set: setExpression,
                            count: parseInt(match[3].trim()),
                            percentage: parseFloat(match[4])
                          });
                        }
                      }

                      // Return parsed data if successful, otherwise return original
                      return parsedData.length > 0 ? parsedData : value;
                    }

                    // Decode Unicode like <U+2229> → ∩
                    let cleaned = value.replace(/<U\+([0-9A-F]{4})>/g, (_, code) =>
                      String.fromCharCode(parseInt(code, 16))
                    );

                    // Trim any embedded newlines or carriage returns in numeric-looking strings
                    if (/[0-9]/.test(cleaned) && /[\n\r]/.test(cleaned)) {
                      cleaned = cleaned.replace(/[\n\r]+/g, " ").trim();
                    }

                    return cleaned;
                  } else if (Array.isArray(value)) {
                    return value.map((v) => sanitizeContent(v));
                  } else if (typeof value === "object" && value !== null) {
                    const cleanObj: Record<string, any> = {};
                    for (const [k, v] of Object.entries(value)) {
                      cleanObj[k] = sanitizeContent(v);
                    }
                    return cleanObj;
                  }
                  return value;
                };

                // --- Single file selected ---
                if (selectedNames.length === 1) {
                  const name = selectedNames[0];
                  const data = sanitizeContent(dataSets[name]);

                  let content: string;
                  let mime: string;
                  let ext: string;

                  if (typeof data === "string") {
                    // Detect CSV or TSV content
                    if (data.includes(",") || data.includes("\t")) {
                      content = data;
                      mime = "text/csv";
                      ext = "csv";
                    } else {
                      content = data;
                      mime = "text/plain";
                      ext = "txt";
                    }
                  } else {
                    // JSON objects → stringify
                    content = JSON.stringify(data, null, 2);
                    mime = "application/json";
                    ext = "json";
                  }

                  const blob = new Blob([content], { type: mime });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${name.replace(/\s+/g, "_")}.${ext}`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  return;
                }

                // --- Multiple selected: merge as JSON ---
                const combined: Record<string, any> = {};
                selectedNames.forEach((name) => {
                  combined[name] = sanitizeContent(dataSets[name]);
                });

                const combinedContent = JSON.stringify(combined, null, 2);
                const blob = new Blob([combinedContent], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `selected_datasets.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              } catch (err) {
                console.error("Download failed:", err);
                alert(
                  "Something went wrong while preparing the download. Check console for details."
                );
              }
            }}
          >
            ⬇ Download Selected
          </Button>
        </Col>
      </Row >

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
                      <div className="loader" />
                    </Card.Text>
                  }
                </div>

                {!props.demo ? <Row>
                  <Form onSubmit={handleSubmit} >
                    <Form.Group className="d-flex">
                      <Form.Control
                        type="text"
                        placeholder="Type your message here..."
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        disabled={!model || loadingModels}
                      />
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={!model || loadingModels}
                      >
                        Send
                      </Button>
                    </Form.Group>
                  </Form>
                </Row> : <></>}

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
  const jobId = params.id || config.exampleJobId || 1;
  const [messages, setMessages] = useState<msg[]>([]);
  const [htmlFiles, setHtmlFiles] = useState<{ file: string, name: string, open: boolean, key: string }[]>([]);
  const [forceUpdate, setForceUpdate] = useState<number>(0);
  const [accodianCtrl, setAccodianCtrl] = useState<string[]>([])

  const [ticking, setTicking] = useState(true),
    [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => ticking && setCount(count + 1), config.aiFetchNewJyupterNotebookfilesFrequency)
    return () => clearTimeout(timer)
  }, [count, ticking])

  useEffect(() => {
    setTimeout(() => {
      axios.get(apiPaths.htmlFiles + "?id=" + jobId).then((response) => {
        console.log(response)
        if (response.data.files)
          if (response.data.files.length > 0) {
            let l = 0;
            const newFiles = [
              ...response.data.files.map(fileObj => (
                {
                  ...fileObj,
                  key: l.toString(),
                  open: !(htmlFiles.map(obj => obj.name)).includes(fileObj.name),
                  temp: l++
                }))
            ]
            setHtmlFiles(newFiles);
            console.log(htmlFiles)
            newFiles.filter(fileObj => fileObj.open).forEach(obj => handleSelect(obj.key))
            setForceUpdate(k += 3 * 2);
          }


      }).catch(err => console.log("axios err:" + err));

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
            demo={props.demo}
            clrs={props.clrs}
            messages={props.demo ? [{ text: "This example job is not editable.", sender: 'user' }] : messages}
            setMessages={props.demo ? (foo) => { } : setMessages}
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
                  <Accordion.Header>{file.name.replace(/_/g, " ").replace(".html", "")}</Accordion.Header>
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