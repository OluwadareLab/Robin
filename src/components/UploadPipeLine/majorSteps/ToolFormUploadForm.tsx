import React, { useState } from 'react';
import { RequiredAsterisk } from '../../misc/RequiredAsterisk';
import { Col, Container, Row } from 'react-bootstrap';
import FileUploadDisplay from '../../fileUpload/FileUploadDisplay';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { apiPaths } from '../../../api/apiConfig';
import { paths } from '../../../config.mjs';
import { InstructionHeader } from '../../misc/instructionHeader';
import { EntryWithRemove } from '../../userInputComponents/removablelistbtn/EntryWithRemove';
import { ResolutionInput } from '../resolutionInput';
import { ToolFileInput } from '../fileInput';
import { ToolNameInput } from '../toolNameInput';
import { ToolData } from '../../tempTypes/Types';
import Creatable, { useCreatable } from 'react-select/creatable';
import MyDropdown from '../categoryInput';


type ToolFormUploadFormProps =  {
    /**
     * @description optional cb to call when the tool data for the form is changed
     * @param data the data
     * @returns void
     */
    setToolDataCb?:(data:ToolData[])=>void;
}

const ToolFormUploadForm = (props:ToolFormUploadFormProps) => {
    const [categories, setCategories] = useState<{"value":string,"label":string}[]>([]);
    const navigate = useNavigate();

    function onSubmit() {
        navigate(paths.referenceUpload + "/" + params.id);
    }

    /**
     * @description check if the user can submit the form
     * @returns boolean
     */
    function canSubmit() {
        //check if any files do not have a name with atleast 2 chars
        if (files.some(file => {
            return file.name.trim().length < 2
        })) {
            //return early saying no if files do no validate
            return false;
        } else if (toolData.some(tool => {
            return tool.name.trim().length < 2 || tool.file == undefined || tool.resolutions.length < 1;
        })) {
            //return early if any tools fail to validate
            return false;
        }

        //if nothing fails to validate return true.
        return true;
    }

    //the tool Data
    const [toolData, _setToolData] = useState<ToolData[]>([new ToolData('')]);
    const [files, setFiles] = useState<File[]>([]);

    /** @description wrap the setter for tool data to pass data upwards to any listening parents */
    const setToolData = (data:ToolData[]) =>{ 
        _setToolData(data);
        if(props.setToolDataCb) props.setToolDataCb(data);
    }

    /**
     * @description on adding a new tool data input
     */
    const handleAddToolData = () => {
        setToolData([...toolData, new ToolData('')]);
    };

     /**
     * @description on removing a tool data input
     */
    const handleRemoveToolData = (toolIndex) => {
        const newData = [...toolData];
        newData.splice(toolIndex, 1)
        setToolData(newData);
        console.log(toolData)
    };

    /**
     * @description on adding a new resolution data input
     */
    const handleAddResolution = (index: number) => {
        const newData = [...toolData];
        newData[index].resolutions.push({
            resolution: 0,
            file: null
        });
        setToolData(newData);
    };

    /**
     * @description on removing a resolution data input
     */
    const handleRemoveResolution = (toolIndex: number, resolutionIndex: number) => {
        const newData = [...toolData];
        newData[toolIndex].resolutions.splice(resolutionIndex, 1)
        setToolData(newData);
    };

    /**
     * @description handle a change to the input of a name
     * @param index the index of the tool
     * @param event the html event
     */
    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newData = [...toolData];
        newData[index] = { ...newData[index], [name]: value };
        setToolData(newData);
    };

    /**
     * @description handle a change to the input of a file
     * @param index the index of the tool
     * @param event the html event
     */
    const handleFileChange = (toolIndex: number, resIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const newData = [...toolData];
            newData[toolIndex].resolutions[resIndex].file = file;
            setToolData(newData);
        }

        let files: (File)[] = []
        toolData.forEach(tool => tool.resolutions.forEach(res => { if (res.file) files.push(res.file) }))
        setFiles(files)
        console.log(files)
    };

    /**
     * @description handle a change to the resolution of a tool
     * @param index the index of the tool
     * @param event the html event
     */
    const handleResolutionChange = (toolIndex: number, resolutionIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const newData = [...toolData];
        newData[toolIndex].resolutions[resolutionIndex].resolution = parseInt(value);
        setToolData(newData);
    };

     /**
     * @description handle a change to the category of a tool
     * @param index the index of the tool
     * @param event the html event
     */
     const handleCategoryChange = (toolIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.value;
        const newData = [...toolData];
        newData[toolIndex].category = value;
        setToolData(newData);
    };

    const params = useParams();

    return (
        <div id="toolUploadComponentForm">
            <InstructionHeader title="Upload Tool Data Files" />
            {toolData.map((tool, toolIndex) => (
                <div key={`ToolContainer-${toolIndex}`} id={`ToolContainer-${toolIndex}`}>
                    <ToolNameInput key={`ToolNameInput-${toolIndex}`}
                        onInputChange={async (e) => handleInputChange(toolIndex, e)}
                        onToolRemove={async () => handleRemoveToolData(toolIndex)}
                        name={tool.name}
                    />

                    <Row>
                        <div className='col-2' >
                            <label htmlFor={`Cat-${tool.name}`} className='col-form-label'>Category</label>
                        </div>
                        <div className='col-sm-8' >
                            <Creatable
                                onChange={async (e) => handleCategoryChange(toolIndex, e)}
                                placeholder="(optional) Type a category name to group this tool with other tools."
                                name={`Cat-${tool.name}`}
                                options={categories}
                                onCreateOption={(option)=>{
                                    setCategories([...categories,{"value":option.trim().replaceAll(' ','-'),"label":option}])
                                }}
                            />
                        </div>
                        
                        
                    </Row>
                    

                    {tool.resolutions.map((resolution, resolutionIndex) => (
                        <Row key={`ToolContainer-ResolutionRow-${resolutionIndex}`} className='form-group row'>
                            <ResolutionInput
                                resolution={resolution.resolution}
                                handleResolutionChange={(e) => handleResolutionChange(toolIndex, resolutionIndex, e)}
                            />
                            <ToolFileInput
                                onFileChange={(e) => handleFileChange(toolIndex, resolutionIndex, e)}
                            />
                            <Col>
                                <button type="button" className="btn btn-secondary" onClick={() => handleRemoveResolution(toolIndex, resolutionIndex)}>Remove</button>
                            </Col>
                        </Row>
                    ))}
                    <button type="button" className='btn btn-secondary' onClick={() => handleAddResolution(toolIndex)}>Add Additional Resolution</button>
                </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={handleAddToolData}>Add New Tool Data</button>
        </div>
    );
};

export default ToolFormUploadForm;
