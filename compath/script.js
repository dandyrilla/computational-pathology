const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');

// Function to resize canvas to full window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Call resizeCanvas on window load and resize
window.onload = resizeCanvas;
window.onresize = resizeCanvas;

// Define points and canvas status
let points = [];
let isDrawing = false;
const closeThreshold = 10; // Threshold distance in pixels to close the polygon

canvas.addEventListener('click', function(event) {

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (points.length > 2 && isNearStartingPoint(x, y, closeThreshold)) {
        closePolygon();
    } else {
        points.push({x, y});
        isDrawing = true;
        drawPolygon();

        const area = calculatePolygonArea(points);
        displayArea(area);
        displayPoints();
    }
});

function isNearStartingPoint(x, y, threshold) {
    const startX = points[0].x;
    const startY = points[0].y;
    const distance = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
    return distance <= threshold;
}

function closePolygon() {

    isDrawing = false;

    drawPolygon();
    const area = calculatePolygonArea(points);
    displayArea(area);
    displayPoints();
    points = []; // Optionally clear points to start a new polygon
}

function drawPolygon() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.setLineDash([]);
    ctx.strokeStyle = 'black';

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    // Close the path if there are enough points
    if (!isDrawing) {
        ctx.closePath();
    }

    // Semi-transparent grey, for example
    ctx.fillStyle = 'rgba(150, 150, 150, 0.5)';
    ctx.fill();

    ctx.stroke();

}

function calculatePolygonArea(points) {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        area += points[i].x * points[j].y;
        area -= points[j].x * points[i].y;
    }
    return Math.abs(area / 2);
}

function displayArea(area) {
    const areaDisplay = document.getElementById('areaDisplay');
    areaDisplay.innerText = area;
}

function displayPoints() {
    const pointsDisplay = document.getElementById('pointsDisplay');
    pointsDisplay.innerText = points.map(p => `(${p.x}, ${p.y})`).join(', ');
}

function resetDrawing() {
    points = [];
    isDrawing = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    displayArea(0);
    displayPoints();
}

canvas.addEventListener('mousemove', function(event) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    drawHoverLine(x, y);
});

function drawHoverLine(x, y) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPolygon(); // Redraw the existing polygon
    if (points.length === 0) return;

    // Draw a line from the last point to the current mouse position
    ctx.beginPath();
    const lastPoint = points[points.length - 1];
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'gray'; // Color for the hover line

    ctx.stroke();

    // Reset the line style to solid
    ctx.setLineDash([]);
}
