a simple entry with a button to remove it

```jsx
    import {useState} from "react";
    import { ReferenceFile } from "../../tempTypes/Types";
    const [file,setFile] = useState(new ReferenceFile(0));
    

    <UploadEntryWithRemove
            fieldLabel={"FieldLabel"}
            handleFileInputChange={setFile}
            handleInputChange={()=>{}}
            handleRemoveToolData={()=>{}}
            placeholder=""
            value={file.fileName}
            entryValue={file.userDefinedFileName}
            fieldIsRequired={true}
        />
```