import { useState, useEffect, useRef } from 'react';
import { Card } from './UI';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './SensorChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Max number of data points to display
const MAX_DATA_POINTS = 20;

const SensorChart = ({ sensorData }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: '#fa541c',
        backgroundColor: 'rgba(250, 84, 28, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Humidity (%)',
        data: [],
        borderColor: '#1677ff',
        backgroundColor: 'rgba(22, 119, 255, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Pressure (hPa)',
        data: [],
        borderColor: '#722ed1',
        backgroundColor: 'rgba(114, 46, 209, 0.1)',
        tension: 0.4,
        hidden: true,
      },
      {
        label: 'Light (lux)',
        data: [],
        borderColor: '#faad14',
        backgroundColor: 'rgba(250, 173, 20, 0.1)',
        tension: 0.4,
        hidden: true,
      }
    ]
  });

  // Options for the chart
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          maxTicksLimit: 5
        }
      },
      x: {
        ticks: {
          maxTicksLimit: 10
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 15
        }
      },
      tooltip: {
        enabled: true
      }
    },
    animation: {
      duration: 300
    },
    elements: {
      point: {
        radius: 2,
        hoverRadius: 5
      }
    }
  };

  // Update chart when new sensor data is received
  useEffect(() => {
    if (!sensorData || !sensorData.timestamp) return;

    setChartData(prevData => {
      // Format the time label
      const timeLabel = new Date(sensorData.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit' 
      });

      // Create new labels array with latest time
      const newLabels = [...prevData.labels, timeLabel];
      if (newLabels.length > MAX_DATA_POINTS) {
        newLabels.shift();
      }

      // Create new datasets with updated values
      const newDatasets = prevData.datasets.map((dataset, index) => {
        // Get the appropriate sensor value based on the dataset index
        let newValue;
        switch (index) {
          case 0: newValue = sensorData.temperature; break;
          case 1: newValue = sensorData.humidity; break;
          case 2: newValue = sensorData.pressure; break;
          case 3: newValue = sensorData.light; break;
          default: newValue = null;
        }

        // Create a new data array with the latest value
        const newData = [...dataset.data, newValue];
        if (newData.length > MAX_DATA_POINTS) {
          newData.shift();
        }

        // Return the updated dataset
        return {
          ...dataset,
          data: newData
        };
      });

      // Return the updated chart data
      return {
        labels: newLabels,
        datasets: newDatasets
      };
    });
  }, [sensorData]);

  return (
    <Card title="Sensor Data Trends" className="sensor-chart-card">
      <div className="chart-container">
        {chartData.labels.length === 0 ? (
          <div className="no-chart-data">
            Waiting for data to display chart...
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </Card>
  );
};

export default SensorChart; 