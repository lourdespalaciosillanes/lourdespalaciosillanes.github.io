const canvas = document.getElementById("encodingCanvas");
const ctx = canvas.getContext("2d");

let currentLevel = 0; // Nivel actual (máximo 3)
let signals = []; // Almacena las señales para redibujarlas en caso de cambio de tamaño

// Función para ajustar el tamaño del lienzo según los niveles
function adjustCanvasSize() {
  const canvasWidth = Math.min(window.innerWidth * 0.9, 600); // Ancho máximo 600px
  const canvasHeight = Math.max(200 + currentLevel * 150, 400); // Altura suficiente para los niveles actuales
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  redrawCanvas(); // Redibuja las señales existentes
}

// Inicializa el tamaño del lienzo al cargar la página
adjustCanvasSize();
window.addEventListener("resize", adjustCanvasSize);

// Función para agregar una cadena y graficar
function addAndDraw() {
  const inputElement = document.getElementById("bitString");
  const input = inputElement.value.trim();
  if (!/^[01]{1,16}$/.test(input)) {
    alert("Por favor, ingrese una cadena válida de hasta 16 bits (solo 0 y 1).");
    return;
  }

  if (currentLevel >= 3) {
    alert("Solo se permiten hasta 3 niveles de señales Ethernet.");
    return;
  }

  const startY = 150 + currentLevel * 150; // Separación vertical entre niveles
  drawAxes(startY);
  drawManchester(input, 100, startY);

  signals.push({ input, startY }); // Guarda la señal y su posición
  currentLevel++;

  inputElement.value = ""; // Limpia el cuadro de texto

  adjustCanvasSize(); // Ajusta el tamaño del lienzo para el nuevo nivel
}

// Limpia el lienzo y reinicia los niveles
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  signals = [];
  currentLevel = 0;
  adjustCanvasSize(); // Reinicia el tamaño del lienzo
}

// Dibuja los ejes (X e Y) en un nivel específico

function drawAxes(centerY) {
  const bitCount = 18; // Cambia de 17 a 18
  const bitWidth = canvas.width / (bitCount + 1); // Calcula el ancho de cada bit
  ctx.beginPath();

  // Línea horizontal del eje X
  ctx.moveTo(100, centerY);
  ctx.lineTo(canvas.width - 20, centerY);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Dibujar etiquetas y divisiones en el eje X
  let x = 100;
  for (let i = 0; i <= bitCount; i++) {
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText(i.toString(), x - 3, centerY + 20); // Etiquetas
    x += bitWidth;
  }

  // Línea vertical del eje Y
  ctx.beginPath();
  ctx.moveTo(100, centerY - 50);
  ctx.lineTo(100, centerY + 50);
  ctx.strokeStyle = "black";
  ctx.stroke();

  // Etiquetas de voltajes
  ctx.fillText("+V", 75, centerY - 35);
  ctx.fillText("0V", 75, centerY + 5);
  ctx.fillText("-V", 75, centerY + 45);
}


// Grafica la codificación Manchester
function drawManchester(bits, startX, centerY) {
  const bitWidth = canvas.width / 17;
  const voltageHeight = 50;
  let x = startX;

  ctx.beginPath();
  for (const bit of bits) {
    if (bit === "0") {
      ctx.moveTo(x, centerY - voltageHeight);
      ctx.lineTo(x + bitWidth / 2, centerY - voltageHeight);
      ctx.lineTo(x + bitWidth / 2, centerY + voltageHeight);
      ctx.lineTo(x + bitWidth, centerY + voltageHeight);
    } else {
      ctx.moveTo(x, centerY + voltageHeight);
      ctx.lineTo(x + bitWidth / 2, centerY + voltageHeight);
      ctx.lineTo(x + bitWidth / 2, centerY - voltageHeight);
      ctx.lineTo(x + bitWidth, centerY - voltageHeight);
    }
    x += bitWidth;
  }
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  const textX = startX + (bits.length * bitWidth) / 2;
  ctx.fillText(bits, textX - ctx.measureText(bits).width / 2, centerY - voltageHeight - 20);
}

// Redibuja las señales existentes
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  signals.forEach(({ input, startY }) => {
    drawAxes(startY);
    drawManchester(input, 100, startY);
  });
}
