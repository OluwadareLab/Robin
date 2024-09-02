a html entry with a button to remove it

```jsx
    import {useState} from "react";
    const [value,setValue] = useState("");

    <EntryWithRemove
            fieldLabel='Tool Name'
            fieldIsRequired={true}
            handleInputChange={(e) => setValue(e.target.value)}
            handleRemoveToolData={()=>{}}
            placeholder="IE: Lasca, CLoops, etc..."
            value={value}
            cannotBeRemoved={false}
    />
```