the component for the toggle button to enable higlass, also renders anything contained inside once flipped

```jsx
    import {useState} from "react";
    const [useHiglass, setUseHiglass] = useState(false);
    const [chromSizesFile, setChromSizesFile] = useState({});
    <HiglassUploadForm
    checked={useHiglass} 
    setChecked={setUseHiglass} 
    chromSizesFile={chromSizesFile} 
    setChromSizesFile={setChromSizesFile}
    />
```