/*
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let drawing = false;
let points = [];

canvas.addEventListener("mousedown", () => {
  drawing = true;
  points = [];
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // 過濾太密的點
  if (points.length > 0) {
    const last = points[points.length - 1];
    if (Math.hypot(x - last.x, y - last.y) < 5) return;
  }

  points.push({x, y});
  drawPerfectCircle();
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
  drawPerfectCircle(); // 最終確認
});

function drawPerfectCircle() {
  if (points.length < 2) return;

  // 計算中心
  let cx = 0, cy = 0;
  points.forEach(p => { cx += p.x; cy += p.y; });
  cx /= points.length;
  cy /= points.length;

  // 計算平均半徑
  const distances = points.map(p => Math.hypot(p.x - cx, p.y - cy));
  const avgR = distances.reduce((a, b) => a + b) / distances.length;

  // 計算平均誤差
  const avgError = distances.reduce((sum, d) => sum + Math.abs(d - avgR), 0) / distances.length;

  // 計算分數 0~100
  let score = Math.max(0, 100 - (avgError / avgR) * 500);

  // 清畫布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 畫手畫軌跡（淡色）
  ctx.strokeStyle = "#ccc";
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // 畫完美圓（紅色）
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.arc(cx, cy, avgR, 0, Math.PI * 2);
  ctx.stroke();

  // 畫圓心
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();

  // 顯示分數
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("圓度分數: " + score.toFixed(0), 10, 20);
}
*/

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d"); // getContext 取得畫布來操作

let drawing = false; // 判斷是否在畫
let points = []; // 記錄點數 以判斷圓度

canvas.addEventListener("pointerdown", (e) => { // 下筆時
  if (e.pointerType !== "pen") return; // 只允許筆
  drawing = true; //要開始畫
  points = []; // 初始化上一次存的
  e.target.setPointerCapture(e.pointerId); // 捕捉筆
});

canvas.addEventListener("pointermove", (e) => { // 開始畫
  if (!drawing) return;
  if (e.pointerType !== "pen") return;

  const rect = canvas.getBoundingClientRect(); //取得位置
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // 過濾太密的點
  if (points.length > 0) {
    const last = points[points.length - 1]; // 和上一個點比
    if (Math.hypot(x - last.x, y - last.y) < 5) return; // Math.hypot : c=a^2+b^2 太近就不存
  }

  points.push({x, y}); // 存入座標
  drawPerfectCircle(); // 畫出來並評分
});

canvas.addEventListener("pointerup", (e) => { //拿開筆
  if (e.pointerType !== "pen") return;
  drawing = false;
  drawPerfectCircle(); // 最終確認
});

function drawPerfectCircle() { // 畫出來與評分
  if (points.length < 2) return; // 至少要 2 點

  // 計算中心
  let cx = 0, cy = 0;
  points.forEach(p => { cx += p.x; cy += p.y; }); 
  cx /= points.length; // 相加取平均來求圓心
  cy /= points.length;

  // 計算平均半徑
  const distances = points.map(p => Math.hypot(p.x - cx, p.y - cy));
  const avgR = distances.reduce((a, b) => a + b) / distances.length; // reduce 累積 再平均

  // 平均誤差 → 分數
  const avgError = distances.reduce((sum, d) => sum + Math.abs(d - avgR), 0) / distances.length;
  let score = Math.max(0, 100 - (avgError / avgR) * 500); // 0 ~ 100 分

  // 清畫布
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 每次都清前一步畫的

  // 畫手畫軌跡（淡灰）
  ctx.strokeStyle = "#ccc";
  ctx.beginPath(); // 繪製開始前都要宣告
  points.forEach((p, i) => { // p : 座標 i : 索引
    if (i === 0) ctx.moveTo(p.x, p.y); // moveto 表示第一個點
    else ctx.lineTo(p.x, p.y); // 畫線
  });
  // ctx.closePath() 如果用了會連回起點
  // ctx.fill() 如果用了會填滿所圍區域 若沒有圍好會沒效果 
  ctx.stroke(); // 渲染 lineTo
  

  // 畫完美圓（紅色）
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.arc(cx, cy, avgR, 0, Math.PI * 2);
  ctx.stroke(); 

  // 畫圓心
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2); // arc 畫圓用 半徑=3
  ctx.fill();

  // 顯示分數
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("圓度分數: " + score.toFixed(0), 10, 20);
}