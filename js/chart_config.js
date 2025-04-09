// chart-config.js - Chart visualization configuration

import Chart from 'chart.js/auto';

export function createSMATrendChart(analyzer, canvasId = 'smaChart') {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Prepare background colors
  const backgroundColors = [];
  const backgroundData = [];
  
  for (let i = 0; i < analyzer.shortTermAverage.length; i++) {
    backgroundColors.push(
      analyzer.isUptrend(i) ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'
    );
    backgroundData.push({
      x: analyzer.shortTermAverage[i].time,
      y: analyzer.shortTermAverage[i].value
    });
  }
  
  // Create chart
  return new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Price',
          data: analyzer.data.map(d => ({x: new Date(d.time), y: d.close})),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          pointRadius: 0
        },
        {
          label: 'Short Term Average',
          data: analyzer.shortTermAverage.map(d => ({x: d.time, y: d.value})),
          borderColor: 'purple',
          borderWidth: 3,
          pointRadius: 0
        },
        {
          label: 'Long Term Average',
          data: analyzer.longTermAverage.map(d => ({x: d.time, y: d.value})),
          borderColor: 'black',
          borderWidth: 3,
          pointRadius: 0
        },
        {
          label: 'Trend',
          data: backgroundData,
          backgroundColor: backgroundColors,
          borderWidth: 0,
          pointRadius: 0,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'MMM d, yyyy'
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Price'
          }
        }
      },
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          position: 'top'
        }
      }
    }
  });
}
