// ข้อมูลสถานีวัดระดับน้ำ
const stations = [
  { id: 1, name: "วังปลาป้อม", yellowAlert: 289.5, redAlert: 290, river: "พะเนียง" },
  { id: 2, name: "โคกกระทอ", yellowAlert: 265.5, redAlert: 266, river: "พะเนียง" },
  { id: 3, name: "วังสามหาบ", yellowAlert: 257.5, redAlert: 258, river: "พะเนียง" },
  { id: 4, name: "บ้านหนองด่าน", yellowAlert: 248.5, redAlert: 249, river: "พะเนียง" },
  { id: 5, name: "บ้านฝั่งแดง", yellowAlert: 236.5, redAlert: 237, river: "พะเนียง" },
  { id: 6, name: "ปตร.หนองหว้าใหญ่", yellowAlert: 215.5, redAlert: 216, river: "พะเนียง" },
  { id: 7, name: "วังหมื่น", yellowAlert: 209.5, redAlert: 210, river: "พะเนียง" },
  { id: 8, name: "ปตร.ปู่หลอด", yellowAlert: 202.5, redAlert: 203, river: "พะเนียง" },
  { id: 9, name: "บ้านข้องโป้", yellowAlert: 200.5, redAlert: 201, river: "พะเนียง" },
  { id: 10, name: "ปตร.หัวนา", yellowAlert: 190.5, redAlert: 191, river: "พะเนียง" },
  { id: 11, name: "คลองบุญทัน", yellowAlert: 230.5, redAlert: 231, river: "โมง" },
  { id: 12, name: "บ้านโคก", yellowAlert: 217.5, redAlert: 218, river: "โมง" }
];

let chart = null;
let currentWaterLevel = 200; // ค่าเริ่มต้น

// ฟังก์ชันสร้างกราฟ
function createChart() {
  const ctx = document.getElementById('waterLevelChart').getContext('2d');

  const stationLabels = stations.map(s => s.name);
  const waterLevelData = stations.map(() => currentWaterLevel);
  const yellowAlertData = stations.map(s => s.yellowAlert);
  const redAlertData = stations.map(s => s.redAlert);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: stationLabels,
      datasets: [
        {
          label: 'ระดับน้ำปัจจุบัน',
          data: waterLevelData,
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: '#2196F3',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 8
        },
        {
          label: 'เกณฑ์เตือน (เหลือง)',
          data: yellowAlertData,
          borderColor: '#FFC107',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0
        },
        {
          label: 'เกณฑ์วิกฤติ (แดง)',
          data: redAlertData,
          borderColor: '#F44336',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 14,
              family: "'Sarabun', sans-serif"
            },
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            family: "'Sarabun', sans-serif"
          },
          bodyFont: {
            size: 13,
            family: "'Sarabun', sans-serif"
          },
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' ม.';
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'สถานีวัดระดับน้ำ',
            font: {
              size: 14,
              family: "'Sarabun', sans-serif"
            }
          },
          ticks: {
            font: {
              size: 12,
              family: "'Sarabun', sans-serif"
            }
          }
        },
        y: {
          title: {
            display: true,
            text: 'ระดับน้ำ (ม.รทก.)',
            font: {
              size: 14,
              family: "'Sarabun', sans-serif"
            }
          },
          beginAtZero: false,
          ticks: {
            font: {
              size: 12,
              family: "'Sarabun', sans-serif"
            }
          }
        }
      }
    }
  });
}

// ฟังก์ชันตรวจสอบสถานะ
function checkStatus(waterLevel) {
  let statusText = '';
  let hasWarning = false;
  let hasCritical = false;

  stations.forEach(station => {
    if (waterLevel >= station.redAlert) {
      hasCritical = true;
    } else if (waterLevel >= station.yellowAlert) {
      hasWarning = true;
    }
  });

  if (hasCritical) {
    statusText = `⚠️ <strong>สถานะวิกฤติ!</strong> ระดับน้ำ ${currentWaterLevel} ม. เกินเกณฑ์เตือนภัยแดง`;
    document.getElementById('statusMessage').style.backgroundColor = '#ffebee';
    document.getElementById('statusMessage').style.color = '#c62828';
  } else if (hasWarning) {
    statusText = `⚡ <strong>เตือน!</strong> ระดับน้ำ ${currentWaterLevel} ม. อยู่ในระดับเตือน`;
    document.getElementById('statusMessage').style.backgroundColor = '#fff3e0';
    document.getElementById('statusMessage').style.color = '#e65100';
  } else {
    statusText = `✅ <strong>ปกติ</strong> ระดับน้ำ ${currentWaterLevel} ม. อยู่ในเกณฑ์ปกติ`;
    document.getElementById('statusMessage').style.backgroundColor = '#e8f5e9';
    document.getElementById('statusMessage').style.color = '#2e7d32';
  }

  document.getElementById('statusMessage').innerHTML = statusText;
}

// ฟังก์ชันอัปเดตตาราง
function updateTable() {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  stations.forEach((station, index) => {
    let status = 'ปกติ';
    let statusClass = 'status-normal';
    let statusColor = '#4CAF50';

    if (currentWaterLevel >= station.redAlert) {
      status = 'วิกฤติ';
      statusClass = 'status-critical';
      statusColor = '#F44336';
    } else if (currentWaterLevel >= station.yellowAlert) {
      status = 'เตือน';
      statusClass = 'status-warning';
      statusColor = '#FFC107';
    }

    const row = `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${station.name}</strong> (${station.river})</td>
        <td><strong>${currentWaterLevel.toFixed(2)}</strong></td>
        <td>${station.yellowAlert}</td>
        <td>${station.redAlert}</td>
        <td><span class="status-badge" style="background-color: ${statusColor};">${status}</span></td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// ฟังก์ชันอัปเดตกราฟ
function updateChart() {
  const input = document.getElementById('waterLevelInput').value;

  if (input === '' || isNaN(input)) {
    alert('กรุณาป้อนค่าระดับน้ำที่ถูกต้อง');
    return;
  }

  currentWaterLevel = parseFloat(input);

  // อัปเดตกราฟ
  if (chart) {
    chart.data.datasets[0].data = stations.map(() => currentWaterLevel);
    chart.update();
  }

  // อัปเดตสถานะ
  checkStatus(currentWaterLevel);

  // อัปเดตตาราง
  updateTable();
}

// ฟังก์ชันเมื่อเพจโหลด
document.addEventListener('DOMContentLoaded', function() {
  // สร้างกราฟ
  createChart();

  // อัปเดตข้อมูลเริ่มต้น
  checkStatus(currentWaterLevel);
  updateTable();

  // ตั้งค่า event listener
  document.getElementById('updateChartBtn').addEventListener('click', updateChart);

  // อนุญาตให้กด Enter ในช่อง input
  document.getElementById('waterLevelInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      updateChart();
    }
  });

  // ตั้งค่าค่าเริ่มต้นในช่อง input
  document.getElementById('waterLevelInput').value = currentWaterLevel;
});
