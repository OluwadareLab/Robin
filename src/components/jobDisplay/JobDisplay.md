A component that displays general info about a job

```jsx
import {Routes, BrowserRouter as Router, Route } from 'react-router-dom';
<Router>
    <JobDisplay
        id={0}
        status={"exampleStatus"}
        title="exampleTitle"
        description={"example desc"}
        email={"optionalemail@optional.com"}
        date="optional/optional/2024"
    />
    </Router>
```