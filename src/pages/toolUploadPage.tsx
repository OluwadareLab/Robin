import React, { useState } from 'react';
import { RequiredAsterisk } from '../components/misc/RequiredAsterisk';
import { Col } from 'react-bootstrap';
import FileUploadDisplay from '../components/fileUpload/FileUploadDisplay';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { apiPaths } from '../api/apiConfig';
import { paths } from '../config.mjs';
import { InstructionHeader } from '../components/misc/instructionHeader';
import { EntryWithRemove } from '../components/userInputComponents/removablelistbtn/EntryWithRemove';


export interface ToolData {
    name: string;
    file: File | null;
    resolutions: ResolutionData[];
}

interface ResolutionData {
    resolution: number;
    file: File | null;
}

const ToolForm: React.FC = () => {
    const navigate = useNavigate();

    function onSubmit(){
        navigate(paths.referenceUpload+"/"+params.id); 
    }
    
    const [toolData, setToolData] = useState<ToolData[]>([{ name: '', file: null, resolutions: [] }]);
    const [files, setFiles] = useState<File[]>([]);

    const handleAddToolData = () => {
        setToolData([...toolData, { name: '', file: null, resolutions: [] }]);
    };

    const handleRemoveToolData = (toolIndex) => {
        const newData = [...toolData];
        newData.splice(toolIndex,1)
        setToolData(newData);
        console.log(toolData)
    };

    const handleAddResolution = (index: number) => {
        const newData = [...toolData];
        newData[index].resolutions.push({
            resolution: 0,
            file: null
        });
        setToolData(newData);
    };

    const handleRemoveResolution = (toolIndex: number, resolutionIndex: number) => {
        const newData = [...toolData];
        newData[toolIndex].resolutions.splice(resolutionIndex,1)
        setToolData(newData);
    };

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newData = [...toolData];
        newData[index] = { ...newData[index], [name]: value };
        setToolData(newData);
    };

    const handleFileChange = (toolIndex: number, resIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const newData = [...toolData];
            newData[toolIndex].resolutions[resIndex].file = file;
            setToolData(newData);
        }

        let files: (File)[] = []
        toolData.forEach(tool=>tool.resolutions.forEach(res=>{if(res.file)files.push(res.file)}))
        setFiles(files)
        console.log(files)
    };

    const handleResolutionChange = (toolIndex: number, resolutionIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const newData = [...toolData];
        newData[toolIndex].resolutions[resolutionIndex].resolution = parseInt(value);
        setToolData(newData);
    };

    const params = useParams();

    return (
        <div className="container-sm w-75"
        style={{padding: ".5% 0 .5% 0"}}
        >
            <InstructionHeader title="Upload Tool Data Files"/>
            {toolData.map((tool, toolIndex) => (
                <div key={toolIndex}>
                     <EntryWithRemove
                        fieldLabel='Tool Name'
                        fieldIsRequired={true}
                        handleInputChange={async (e) => handleInputChange(toolIndex, e)}
                        handleRemoveToolData={async () => handleRemoveToolData(toolIndex)}
                        placeholder="IE: Lasca, CLoops, etc..."
                        value={tool.name}
                        key={toolIndex}

                    />
     
                    {tool.resolutions.map((resolution, resolutionIndex) => (

                        <div key={resolutionIndex} className='form-group row'>
                            <label htmlFor='resolutionInput' className='col-2 col-form-label'>Resolution<RequiredAsterisk active={true} /></label>
                            <div className='col-sm-2'>
                                <input
                                    className='input-sm form-control'
                                    id="resolutionInput"
                                    type="number"
                                    list="resolutions"
                                    placeholder="IE: 1000, 5000..."
                                    value={resolution.resolution}
                                    onChange={(e) => handleResolutionChange(toolIndex, resolutionIndex, e)}
                                />
                                <datalist id="resolutions">
                                    <option value="1000"/>
                                    <option value="5000"/>
                                    <option value="250000"/>
                                    <option value="500000"/>
                                </datalist>
                              
                                
                            </div>

                            <div className='col-sm-6'>
                                <input
                                    className='col-sm-2 form-control'
                                    type="file"
                                    name="file"
                                    onChange={(e) => handleFileChange(toolIndex, resolutionIndex, e)}
                                />
                            </div>
                            <Col>
                            <button className="btn btn-secondary" onClick={()=>handleRemoveResolution(toolIndex, resolutionIndex)}>Remove</button>
                            </Col>


                        </div>
                    ))}
                    <button className='btn btn-secondary' onClick={() => handleAddResolution(toolIndex)}>Add Additional Resolution</button>
                </div>
            ))}
            <button className="btn btn-primary" onClick={handleAddToolData}>Add New Tool Data</button>
            <hr></hr>
            <FileUploadDisplay toolData={toolData} fileTypes='.tsx' id={params.id? parseInt(params.id) : 0 } cb={onSubmit}/>
            
        </div>

    );
};

export default ToolForm;
