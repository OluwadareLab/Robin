import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiPaths } from "../../api/apiConfig";
import { CustomLegendWithSelection } from "../graph/CustomLegend";
import { InstructionHeader } from "../misc/instructionHeader";
import Select from 'react-select';
import { BtnConfirm } from "../buttons/BtnConfirm";
import { Button, Col, Row, Tabs } from "react-bootstrap";

type JobDataTabProps = {
    /** the id of the job */
    jobId: number;

    /** array for color consistancy */
    clrs: any[];
};

/** @description a tab that allows users to download their data back from the server. */
export default function (props: JobDataTabProps) {
    const id = props.jobId

    const [allUploads, setAllUploadData] = useState([]);
    /** Data for the tools */
    const [uploadData, setUploadData] = useState([]);
    /** @description an array of tool names */
    const [toolNames, setToolNames] = useState([]);

    /** @description the selected tool */
    const [selectedTool, _setSelectedTool] = useState("");
    function setSelectedTool(val) {
        _setSelectedTool(val);
        console.log(val.value);
        console.log(uploadData);
        updateList(uploadData,val);
        //wipe when a user switches tools.
        setSelectedFiles({});

    }

    function updateList(_uploadData, val){
        if (Object.keys(_uploadData).includes(val.value)) {
            console.log(_uploadData[val.value]);
            setFilesInSelectedTools(_uploadData[val.value]);
        } else if (val.value == "all") {
            setFilesInSelectedTools(allUploads)
        }
    }

    /** @description an array of all files avalible in selected tool */
    const [filesInSelectedTools, setFilesInSelectedTools] = useState([]);

    const [selectedFiles, _setSelectedFiles] = useState([]);
    function setSelectedFiles(val) {
        console.log(val);
        _setSelectedFiles(val);
    }

    /** submit a axios dl reqeust for each file selected */
    function downloadFiles() {
        let files: string[] = [];
        console.log(selectedFiles);
        Object.keys(selectedFiles).forEach(key => {
            console.log(key);
            if (selectedFiles[key]) {
                files.push(key);
            }
        })

        console.log(files);
        if(files.length <= 0) {
            alert("You have not selected any files. You must select atleast 1.");
            return;
        }
        files.forEach(file => {
            let data = {
                id: props.jobId,
                fileName: file,
            }

            axios.post(apiPaths.fileDownload, data).then((res: any) => {
                const fileBody = res.data;
                const blob = new Blob([fileBody], { type: 'text/plain' });

                // Create a URL for the Blob
                const url = URL.createObjectURL(blob);

                // Create a temporary anchor element
                const a = document.createElement('a');
                a.href = url;
                a.download = file; // Name of the downloaded file

                // Append the anchor to the body, trigger click, and then remove it
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // Revoke the Blob URL to free up resources
                URL.revokeObjectURL(url);
                console.log(res.data);
            })
        })

    }

    useEffect(() => {
        const fetchQueuePosition = async () => {
            axios.get(apiPaths.jobUploads + "?id=" + id).then((response) => {
                //console.log(response)
                if (response.status === 200) {
                    let names = {};
                    let data = {}
                    response.data.files.forEach(name => {
                        let partialName: string = name.split("_")[0];
                        if (!partialName.includes("reference") && !partialName.includes("chrom")) {
                            names[partialName] = partialName
                            if (!data[partialName]) data[partialName] = [];
                            data[partialName].push(name);

                        }
                    });
                    names["all"] = "all"
                    names = Object.keys(names).map(name => ({ label: name, value: name }));
                    console.log("herhasehaehar")
                    console.log(response.data.files);
                    console.log(data);
                    console.log(names);
                    setToolNames(names);
                    setUploadData(data);
                   
                    setAllUploadData(response.data.files);

                    setSelectedTool(names[0]);
                    updateList(data,names[0]);
                   
                    
                }


            }).catch(err => console.log("axios err:" + err));
        };
        fetchQueuePosition();
    }, []);


    let k = 0;
    return <>
        <Row>
            <InstructionHeader title='Select tool to view uploaded data for:' />
            <label htmlFor='toolSelector'></label>
            <Select
                name="toolSelector"
                options={toolNames}
                //defaultValue={{ label: "Select Dept", value: 0 }}
                value={selectedTool}
                inputValue=""
                className="onTop"
                onChange={(val, other) => { console.log(val); setSelectedTool(val) }}
            >
            </Select>
            <hr />
            <InstructionHeader title='Select files to download:' />
        </Row>
        <Row>
            <Col>
                <CustomLegendWithSelection
                    state={selectedFiles}
                    setState={setSelectedFiles}
                    items={
                        filesInSelectedTools.map(name => ({
                            "label": name,
                            "backgroundColor": props.clrs[k++]
                        }))
                    }
                    onSelect={(state) => { setSelectedFiles(state) }}
                    forceUpdate={1}
                    max={100}
                />
                
                <Button onClick={downloadFiles} variant={Object.keys(selectedFiles).reduce(
                        (accumulator, currentValue) => accumulator + (selectedFiles[currentValue]?1:0),
                        0,)
                     >=1?"primary":"secondary"}>Download Selected Files</Button>
            </Col>

        </Row>

    </>


}