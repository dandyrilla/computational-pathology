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
