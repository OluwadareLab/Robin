import React, { useEffect } from 'react';
import higlass from 'higlass';

export const HiGlassComponent = () => {
  useEffect(() => {
    // Initialize HiGlass
    const container = document.getElementById('higlass-container');
    const options = {
      // Define your HiGlass view configuration here
      views: [{
        uid: 'view1',
        initialXDomain: [0, 100000],
        initialYDomain: [0, 100000],
        tracks: {}
      }]
    };
    const api = higlass.mountApp(container, options);

    return () => {
      // Cleanup HiGlass when component unmounts
      api.destroy();
    };
  }, []);

  return (
    <div id="higlass-container" style={{ width: '800px', height: '600px' }}></div>
  );
};

