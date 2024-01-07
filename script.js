/*
    VARIABLES
 */
let container = document.querySelector(".pixelContainer");
container.addEventListener("mouseover", draw);

let placeHolder = document.querySelector("#totalSize");

let colorPicker = document.querySelector("#colorPicker");
colorPicker.addEventListener("change", changePenColor);

let pixelsPerRow = 16;
let pixelsCount = pixelsPerRow * pixelsPerRow;
let pixelSideLength = container.clientHeight / pixelsPerRow;
let pen = "black";
let color = colorPicker.value;

let inputs = document.querySelectorAll("input");
let labels = document.querySelectorAll("label");

let radioButtons = document.querySelector(".radioButtons");
radioButtons.addEventListener("click", changePen);
let radioButtonsRight = document.querySelector(".radioButtons.right");
radioButtonsRight.addEventListener("click", changePen);

let clearButton = document.querySelector("#clear");
clearButton.addEventListener("click", eraseGrid);

let removeBordersButton = document.querySelector("#removeBorders");
removeBordersButton.addEventListener("click", changeBorders);
let removeBorders = false; // true when removeborders is clickable, false when addborders is clickable

let changeRowLengthButton = document.querySelector("#changeSize");
changeRowLengthButton.addEventListener("click", openModal);

let modal = document.querySelector("#changePixelWidth");
modal.addEventListener("submit", redraw);

let penLabel = radioButtons.querySelector("label[for='black']");

/*
    FUNCTIONS - MODAL
 */
function openModal(evt) {
  placeHolder.textContent = pixelsPerRow;
  modal.showModal();
}
function redraw(evt) {
  pixelsPerRow = evt.target[0].value;
  eraseGrid();
}

/*
    FUNCTIONS - PEN
 */
function changePenColor(evt) {
  color = evt.target.value;
  changePen(evt.target.parentElement.previousElementSibling);
}

function changePen(evt) {
  let input = evt.target ? evt.target : evt;
  if (input.tagName === "INPUT") {
    switch (input.id) {
      case "black":
      case "rainbow":
      case "brighten":
      case "darken":
      case "eraser":
        resetClasses();
        pen = input.id;
        penLabel = input.nextElementSibling;
        penLabel.className = "active";
        break;
    }
  }
}

function defaultPen() {
  resetClasses();
  pen = "black";
  penLabel.className = "active";
}

/*
    FUNCTIONS - PIXEL CONTAINER
 */
function drawGrid() {
  pixelsCount = pixelsPerRow * pixelsPerRow;
  pixelSideLength = Math.round(640 / pixelsPerRow);
  console.log(pixelSideLength);
  const fragment = document.createDocumentFragment();

  const pixelStyle = `background-color: rgb(255,255,255);`;
  // prettier-ignore
  container.style.cssText = `grid-template-columns: repeat(${pixelsPerRow}, 1fr); height: ${pixelSideLength * pixelsPerRow}px; width: ${pixelSideLength * pixelsPerRow}px;`;

  container.innerHTML = ""; // Clear existing pixels

  for (let i = 0; i < pixelsCount; i++) {
    let pixel = document.createElement("div");
    pixel.className = "pixel";
    pixel.style.cssText = pixelStyle; // Apply common style
    fragment.appendChild(pixel);
  }

  container.appendChild(fragment);
}
function changeBorders(evt) {
  if (evt) {
    evt.target.nextElementSibling.textContent = removeBorders
      ? "Remove Borders"
      : "Add Borders";
    removeBorders = !removeBorders;
  }

  container.classList.toggle("no-border");
}

function eraseGrid(evt) {
  drawGrid();
}

function resetClasses() {
  inputs.forEach((input) => {
    input.labels[0].className = "";
  });
}

/*
    FUNCTIONS - DRAW PIXELS
 */
function draw(evt) {
  let backgroundClr = evt.target.style.backgroundColor;
  if (evt.target.className === "pixelContainer") return;
  switch (pen) {
    case "black":
      evt.target.style.backgroundColor = color;
      break;
    case "rainbow":
      evt.target.style.backgroundColor = rainbowColor();
      break;
    case "darken":
      evt.target.style.backgroundColor = darken(backgroundClr);
      break;
    case "brighten":
      evt.target.style.backgroundColor = brighten(backgroundClr);
      break;
    case "eraser":
      evt.target.style.backgroundColor = "rgb(255,255,255)";
      break;
  }
}
// prettier-ignore
function rainbowColor() {
  return `rgb(
  ${Math.floor(Math.random() * 256)},
  ${Math.floor(Math.random() * 256)},
  ${Math.floor(Math.random() * 256)}
  )`;
}

function brighten(backgroundClr) {
  let r, g, b;
  [r, g, b] = [...getRGB(backgroundClr)];
  return `rgb(
  ${Math.min(255, r + 26)},
  ${Math.min(255, g + 26)},
  ${Math.min(255, b + 26)}
  )`;
}

function darken(backgroundClr) {
  let r, g, b;
  [r, g, b] = [...getRGB(backgroundClr)];

  return `rgb(
  ${Math.max(0, r - 26)},
  ${Math.max(0, g - 26)},
  ${Math.max(0, b - 26)}
  )`;
}

function getRGB(color) {
  let colorArr = color.slice(color.indexOf("(") + 1, color.indexOf(")"));
  colorArr = colorArr.split(",");
  return colorArr.map((color) => +color);
}

/*
    START
 */
defaultPen();
drawGrid();
