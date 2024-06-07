const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const currentCtx = document.getElementById("current").getContext("2d");

const image = document.getElementById("image");
const bomb = document.getElementById("bomb");

const size = 40;
const squareCountX = 5;
const squareCountY = 5;
let whiteLineThickness = 4;

const items = new Map();
let currentX = 0;
let currentY = 0;

let getKey = (x,y) => {
  return `${x}.${y}`;
}

let newgame = () => {

  ctx.fillStyle = "#bca0dc";
  
  for (let x = 0; x < squareCountX; x++) {
    for(let y = 0; y < squareCountY; y++) {
      const item = {
        value: getRandomBombValue(),
        status: 1,
      };

      items.set(getKey(x,y), item);

      ctx.fillRect(x * size, y * size, 
        size - whiteLineThickness, size - whiteLineThickness);
    }
  }

  drawCurrent();
}

let drawCurrent = () => {
  currentCtx.clearRect(0, 0, canvas.width, canvas.height);
  currentCtx.strokeStyle = "red";
  currentCtx.strokeRect(currentX * size, currentY * size, 
    size - whiteLineThickness, size - whiteLineThickness);
}

let getRandomBombValue = () => {
  return Math.floor(Math.random() * 2);
}

let moveDown = () => {
  currentY = currentY + 1;
  if (currentY >= squareCountY) {
    currentY = 0;
  }
  drawCurrent();
}

let moveUp = () => {
  currentY = currentY - 1;
  if (currentY < 0) {
    currentY = squareCountY - 1;
  }
  drawCurrent();
}

let moveLeft = () => {
  currentX = currentX - 1;
  if (currentX < 0) {
    currentX = squareCountX - 1;
  }
  drawCurrent();
}

let moveRight = () => {
  currentX = currentX + 1;
  if (currentX >= squareCountX) {
    currentX = 0;
  }
  drawCurrent();
}

let hit = () => {
  const key = getKey(currentX, currentY);
  const item = items.get(key);
  if (item.status == 0) {
    return;
  }

  const x = currentX;
  const y = currentY;

  if (item.value == 1) {
    ctx.drawImage(bomb, 0, 0, 24, 24, x * size, y * size, size, size);
    return;
  }

  const nearest = [
    getKey(x-1, y-1), getKey(x, y-1), getKey(x+1, y-1),
    getKey(x-1, y), getKey(x+1, y),
    getKey(x-1, y+1), getKey(x, y+1), getKey(x+1, y+1)
  ].map((key) => items.get(key))
   .reduce((p, c) => {
      if (c) {
        p = p + c.value;
      }
      return p;
      }, 0
    );

  ctx.drawImage(image, 0, nearest * 24, 24, 24, x * size, y * size, size, size);
  item.status = 0;
}

window.addEventListener("keydown", (event) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key#examples
    if (event.defaultPrevented) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        moveDown();
        break;
      case "ArrowUp":
        moveUp();
        break;
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case " ": // space
        hit();
        break;
      default:
        return;
    }
    event.preventDefault();
  },
  true,
);
