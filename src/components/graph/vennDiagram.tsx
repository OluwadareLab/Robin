import React, { useEffect } from "react";
import { VennDiagramChart, extractSets } from "chartjs-chart-venn";
var i = 0;
const VennDiagramComponent = () => {
  const config = {
    type: "euler",
    data: {
      labels: [
        "Soccer",
        "Tennis",
        "Volleyball",
        "Soccer ∩ Tennis",
        "Soccer ∩ Volleyball",
        "Tennis ∩ Volleyball",
        "Soccer ∩ Tennis ∩ Volleyball"
      ],
      datasets: [
        {
          label: "Sports",
          data: [
            { sets: ["Soccer"], value: 2 },
            { sets: ["Tennis"], value: 0 },
            { sets: ["Volleyball"], value: ["LAK2011", "LAK2011"] },
            { sets: ["Soccer", "Tennis"], value: "a" },
            { sets: ["Soccer", "Volleyball"], value: 0 },
            { sets: ["Tennis", "Volleyball"], value: "a" },
            { sets: ["Soccer", "Tennis", "Volleyball"], value: "a" }
          ]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Chart.js Venn Diagram Chart"
      }
    }
  };

//   i++;
//   useEffect(() => {
//     const ctx = document.getElementById(`ven:${i}`);
//     const d = new VennDiagramChart(ctx, config);
//   }, []);

  
  return (
    <>
      <div className="App">
        <canvas id={`ven:${i}`}></canvas>
      </div>
    </>
  );
};

export default VennDiagramComponent;
