The component for uploading protien reference files
```jsx
    import {BrowserRouter as Router} from 'react-router-dom';
    import {useState} from "react";
    const [protienRefFiles, setProtienRefFiles] = useState([]);
    const [protienRefFileNames, setProtienRefFileNames] = useState([]);
    
    <Router>
        <ProtienReferenceUploadForm
        setRefFileNames={setProtienRefFileNames}
        setRefFiles={setProtienRefFiles}
        refFiles={protienRefFiles}
        refNames={protienRefFileNames}
        />
    </Router>
```