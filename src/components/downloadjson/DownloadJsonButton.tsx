import React from 'react';
import { Button } from 'react-bootstrap';

/** @description a button that allows for json data to be converted to a string and downloaded. */
export function DownloadJsonButton({ jsonData }) {
  const downloadJson = () => {
    // Convert JSON data to a string
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json'; // Name of the downloaded file

    // Append the anchor to the body, trigger click, and then remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the Blob URL to free up resources
    URL.revokeObjectURL(url);
  };

  return <Button onClick={downloadJson}>Download JSON</Button>;
}
