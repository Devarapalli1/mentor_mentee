import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function ProgressChart({ goals }) {
  const [data, setData] = useState({
    labels: ["In Progress", "Completed"],
    datasets: [
      {
        data: [0, 100],
        backgroundColor: ["#ff9800", "#004d40"],
        hoverBackgroundColor: ["#ffa726", "#00695c"],
      },
    ],
  });

  useEffect(() => {
    if (goals.length > 0) {
      const mappedGoals = goals.map((goal) => goal.progress);
      const inprogress =
        mappedGoals.reduce((a, b) => a + b) / mappedGoals.length;

      setData({
        labels: ["In Progress", "Completed"],
        datasets: [
          {
            data: [inprogress, 100 - inprogress],
            backgroundColor: ["#ff9800", "#004d40"],
            hoverBackgroundColor: ["#ffa726", "#00695c"],
          },
        ],
      });
    }
  }, [goals]);

  return <Doughnut data={data} className="chart" />;
}

export default ProgressChart;
