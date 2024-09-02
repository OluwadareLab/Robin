A component that allows downloading an image of any Chart from chartjs. this is included as part of most other chart components.
DownloadImg example:


#### DownloadImg component with ExampleGraph 
```jsx noeditor
import {ExampleGraph} from "./ExampleGraph"
import { useRef } from 'react';
const ref = useRef(null);


<>
    
    <ExampleGraph ref={ref}/>
    <DownloadImg chartRef={ref}/>
</>

```