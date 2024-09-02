a component with both an file upload and a input entry


```jsx
    import { ReferenceFile } from "../../tempTypes/Types";
    import { useState } from "react";
    
    const [file,setFile] = useState(new ReferenceFile(0));
    const [value,setValue] = useState("");

    <UploadEntryWithRemoveAndInput
        fieldIsRequired={true}
        fieldLabel={"Matrix Name"}
        handleInputChange={(e) => setValue(e.target.value)}
        handleFileInputChange={setFile}
        handleRemoveToolData={()=>{}}
        fieldIsRequired={true}
        placeholder={""}
        entryValue={value}
    />
```