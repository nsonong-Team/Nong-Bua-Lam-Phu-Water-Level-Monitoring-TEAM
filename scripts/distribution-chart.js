// ฟังก์ชันคำนวณ Normal Distribution
function normalDistribution(x, mean, stdDev) {
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return coefficient * Math.exp(exponent);
}

// ฟังก์ชันวาดกราฟ
function drawChart() {
  const canvas = document.getElementById('distributionChart');
  const ctx = canvas.getContext('2d');

  // ดึงค่า input
  const mean = parseFloat(document.getElementById('meanValue').value);
  const stdDev = parseFloat(document.getElementById('stdDevValue').value);

  // อัปเดต statistics
  document.getElementById('statMean').textContent = mean;
  document.getElementById('statStdDev').textContent = stdDev.toFixed(1);

  // ตั้งค่า canvas
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  ctx.scale(dpr, dpr);

  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;

  // ระยะขอบ
  const padding = 60;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - 2 * padding;

  // พิจารณาช่วงค่า
  const minX = mean - 4 * stdDev;
  const maxX = mean + 4 * stdDev;
  const xRange = maxX - minX;

  // ค้นหาค่า max ของ y สำหรับมาตราส่วน
  let maxY = 0;
  for (let x = minX; x <= maxX; x += xRange / 500) {
    const y = normalDistribution(x, mean, stdDev);
    if (y > maxY) maxY = y;
  }

  // ฟังก์ชันแปลงพิกัดจากข้อมูลเป็นพิกเซล
  function dataToCanvas(x, y) {
    const canvasX = padding + ((x - minX) / xRange) * graphWidth;
    const canvasY = height - padding - (y / maxY) * graphHeight;
    return { x: canvasX, y: canvasY };
  }

  // ล้าง canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // วาดเส้นแกน
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.stroke();

  // วาดป้ายแกน Y
  ctx.fillStyle = '#333';
  ctx.font = '12px Sarabun, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('ความถี่', padding - 20, padding - 10);

  // วาดป้ายแกน X
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('ระดับน้ำ (ม.รทก.)', width / 2, height - 20);

  // วาดตัวเลขบนแกน X
  const xTickCount = 7;
  for (let i = 0; i <= xTickCount; i++) {
    const x = minX + (i / xTickCount) * xRange;
    const pos = dataToCanvas(x, 0);

    // เส้นขีด
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(pos.x, height - padding);
    ctx.lineTo(pos.x, height - padding + 10);
    ctx.stroke();

    // ตัวเลข
    ctx.fillStyle = '#333';
    ctx.fillText(Math.round(x), pos.x, height - padding + 20);
  }

  // วาดตัวเลขบนแกน Y
  const yTickCount = 5;
  for (let i = 0; i <= yTickCount; i++) {
    const y = (i / yTickCount) * maxY;
    const pos = dataToCanvas(minX, y);

    // เส้นขีด
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(padding - 10, pos.y);
    ctx.lineTo(padding, pos.y);
    ctx.stroke();

    // ตัวเลข
    ctx.fillStyle = '#333';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(y.toFixed(3), padding - 15, pos.y);
  }

  // วาดกราฟ bell curve พร้อมสี
  const dataPoints = [];
  for (let x = minX; x <= maxX; x += xRange / 500) {
    const y = normalDistribution(x, mean, stdDev);
    dataPoints.push({ x, y });
  }

  // วาดพื้นที่ใต้เส้น (filled areas)
  // ±2σ (4.55%) - สีแดง
  drawFilledArea(ctx, dataPoints, minX, mean - 2 * stdDev, '#ff1744', 0.6, dataToCanvas, maxY, height, padding, graphHeight);
  drawFilledArea(ctx, dataPoints, mean + 2 * stdDev, maxX, '#ff1744', 0.6, dataToCanvas, maxY, height, padding, graphHeight);

  // ±1σ ถึง ±2σ (27.18%) - สีฟ้า
  drawFilledArea(ctx, dataPoints, mean - 2 * stdDev, mean - stdDev, '#4fc3f7', 0.6, dataToCanvas, maxY, height, padding, graphHeight);
  drawFilledArea(ctx, dataPoints, mean + stdDev, mean + 2 * stdDev, '#4fc3f7', 0.6, dataToCanvas, maxY, height, padding, graphHeight);

  // ±1σ (68.27%) - สีเหลือง
  drawFilledArea(ctx, dataPoints, mean - stdDev, mean + stdDev, '#ffd600', 0.6, dataToCanvas, maxY, height, padding, graphHeight);

  // วาดเส้นโค้ง
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 3;
  ctx.beginPath();

  let firstPoint = true;
  for (const point of dataPoints) {
    const pos = dataToCanvas(point.x, point.y);
    if (firstPoint) {
      ctx.moveTo(pos.x, pos.y);
      firstPoint = false;
    } else {
      ctx.lineTo(pos.x, pos.y);
    }
  }

  ctx.stroke();

  // วาดเส้นแนวตั้งที่จุด mean
  const meanPos = dataToCanvas(mean, 0);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(meanPos.x, padding);
  ctx.lineTo(meanPos.x, height - padding);
  ctx.stroke();
  ctx.setLineDash([]);

  // เพิ่มป้ายกำกับสำหรับจุด mean
  const meanPointPos = dataToCanvas(mean, normalDistribution(mean, mean, stdDev));
  ctx.fillStyle = '#333';
  ctx.fillText('μ=' + mean, meanPos.x, padding - 20);

  // วาดจุดที่จุด mean
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(meanPointPos.x, meanPointPos.y, 5, 0, 2 * Math.PI);
  ctx.fill();
}

// ฟังก์ชันวาดพื้นที่สีใต้เส้น
function drawFilledArea(ctx, dataPoints, xMin, xMax, color, alpha, dataToCanvas, maxY, height, padding, graphHeight) {
  const filteredPoints = dataPoints.filter(p => p.x >= xMin && p.x <= xMax);

  if (filteredPoints.length === 0) return;

  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;

  ctx.beginPath();
  const firstPos = dataToCanvas(filteredPoints[0].x, filteredPoints[0].y);
  ctx.moveTo(firstPos.x, height - padding);
  ctx.lineTo(firstPos.x, firstPos.y);

  for (let i = 1; i < filteredPoints.length; i++) {
    const pos = dataToCanvas(filteredPoints[i].x, filteredPoints[i].y);
    ctx.lineTo(pos.x, pos.y);
  }

  const lastPos = dataToCanvas(filteredPoints[filteredPoints.length - 1].x, filteredPoints[filteredPoints.length - 1].y);
  ctx.lineTo(lastPos.x, height - padding);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 1.0;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('distributionChart');

  // ตั้งค่าขนาดเริ่มต้น
  function resizeCanvas() {
    canvas.style.width = '100%';
    canvas.style.height = '500px';
    drawChart();
  }

  resizeCanvas();

  // วาดกราฟเมื่อโหลด
  window.addEventListener('resize', drawChart);

  // ปุ่มอัปเดต
  document.getElementById('updateBtn').addEventListener('click', drawChart);

  // Enter key ในช่อง input
  document.getElementById('meanValue').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') drawChart();
  });

  document.getElementById('stdDevValue').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') drawChart();
  });
});
