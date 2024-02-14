import { HiGlassComponent } from 'higlass';
import React from 'react';

export const HiGlass = props => <HiGlassComponent
  ref={props.onRef}
  options={props.options}
  viewConfig={props.viewConfig}
/>

