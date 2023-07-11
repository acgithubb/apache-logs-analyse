import React, { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import data from "./access.txt" 
import './App.css';

Chart.register(...registerables);

const LogChart = () => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [logData, setLogData] = useState([]);

  const fetchLogData = async () => {
    try {
      const response = await fetch(data);
      const text = await response.text();
      console.log('Fetched log data:', text); // Log the fetched data
      const lines = text.split('\n');
      const errorCodes = {};

      lines.forEach((line) => {
        const matches = line.match(/HTTP\/1.1" (\d+)/);
        if (matches && matches.length > 1) {
          const errorCode = matches[1];
          errorCodes[errorCode] = (errorCodes[errorCode] || 0) + 1;
        }
      });

      console.log('Parsed log data:', errorCodes); // Log the parsed data
      setLogData(errorCodes);
    } catch (error) {
      console.error('Error fetching log data:', error);
    }
  };

  useEffect(() => {
    fetchLogData();
  }, []);

  useEffect(() => {
    if (barChartRef.current && Object.keys(logData).length > 0) {
      const ctx = barChartRef.current.getContext('2d');
      const labels = Object.keys(logData);
      const data = Object.values(logData);

      const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Error Codes',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              precision: 0,
            },
          },
        },
      });

      // Clear chart on component unmount
      return () => {
        barChart.destroy();
      };
    }
  }, [logData]);

  useEffect(() => {
    if (pieChartRef.current && Object.keys(logData).length > 0) {
      const ctx = pieChartRef.current.getContext('2d');
      const labels = Object.keys(logData);
      const data = Object.values(logData);

      const pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Error Code Distribution',
            },
          },
          layout: {
            padding: {
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            },
          },
        },
      });

      // Clear chart on component unmount
      return () => {
        pieChart.destroy();
      };
    }
  }, [logData]);

  return (
    <>
      <div className="dashboard">
        <div class="flex gap-8">
          <div class="flex-none">
            <div className='dashboard-left'>
              {/* <nav class="dd-bg">
                <ul>
                  <li><a href='/' >DashBoard</a></li>
                  <li><a href='/' >DashBoard</a></li>
                  <li><a href='/' >DashBoard</a></li>
                  <li><a href='/' >DashBoard</a></li>
                  <li><a href='/' >DashBoard</a></li>
                  <li><a href='/' >DashBoard</a></li>
                </ul>
              </nav> */}
            </div>
          </div>
          <div class="flex-auto w-64">
            <div className='rounded shadow-lg bg-slate-50'>
              <canvas ref={barChartRef} />  
            </div> 
          </div>
          <div class="flex-auto w-32">
            <div className='rounded shadow-lg bg-slate-50'>
              <canvas ref={pieChartRef} style={{ width: '50%', margin: '0 auto' }} />
            </div> 
          </div>
        </div>  
      </div> 
    </>
  );
};

export default LogChart;
