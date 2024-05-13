const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const blockSize = 40;
const widthInBlocks = canvas.width / blockSize;
const heightInBlocks = canvas.height / blockSize;
const scoreHTML = document.getElementById("scoreHTML");
const highScoreHTML = document.getElementById("highScoreHTML");
const gameOverScore = document.getElementById("gameOverScore");
const gameOverHighScore = document.getElementById("gameOverHighScore");
const gameOverHTML = document.getElementById("gameOverHTML");
const restartBtn = document.getElementById("restartBtn");
const gameContainer = document.getElementById("gameContainer");
const gameOverContainer = document.getElementById("gameOverContainer");
const startGameBtn = document.getElementById("startGameBtn");
const startScreen = document.getElementById("startScreen");
const levelHTML = document.getElementById("levelHTML");

let snake = [];
let food = {};
let direction = "right";
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let level = 1;

//load music
const bgMusic = new Audio();
bgMusic.src = "./assets/bg.mp3";
bgMusic.loop = true;
bgMusic.volume = 0.1;

const eatSound = new Audio();
eatSound.src = "./assets/eat.wav";
eatSound.volume = 0.1;

const gameOverSound = new Audio();
gameOverSound.src = "./assets/lose.wav";
gameOverSound.volume = 0.1;

const foodImg = new Image();
foodImg.src = "./assets/apple.png";

function drawScore() {
  scoreHTML.innerHTML = `Score: ${score}`;
  highScoreHTML.innerHTML = `High Score: ${highScore}`;
}

function increaseLevel() {
  if (score >= level * 100) {
    level++;
    levelHTML.innerHTML = `Level: ${level}`;
  }
}

function drawSnake() {
  snake.forEach((block, index) => {
    if (index === 0) {
      ctx.fillStyle = "green";
      ctx.fillRect(block.x, block.y, blockSize, blockSize);

      const eyeSize = blockSize / 5;
      const eyeOffset = blockSize / 4;

      ctx.fillStyle = "white";

      if (direction === "right") {
        ctx.fillRect(
          block.x + eyeOffset,
          block.y + eyeOffset,
          eyeSize,
          eyeSize
        );
        ctx.fillRect(
          block.x + eyeOffset,
          block.y + blockSize - eyeOffset - eyeSize,
          eyeSize,
          eyeSize
        );
      } else if (direction === "left") {
        ctx.fillRect(
          block.x + blockSize - eyeOffset - eyeSize,
          block.y + eyeOffset,
          eyeSize,
          eyeSize
        );
        ctx.fillRect(
          block.x + blockSize - eyeOffset - eyeSize,
          block.y + blockSize - eyeOffset - eyeSize,
          eyeSize,
          eyeSize
        );
      } else if (direction === "up") {
        ctx.fillRect(
          block.x + eyeOffset,
          block.y + blockSize - eyeOffset - eyeSize,
          eyeSize,
          eyeSize
        );
        ctx.fillRect(
          block.x + blockSize - eyeOffset - eyeSize,
          block.y + blockSize - eyeOffset - eyeSize,
          eyeSize,
          eyeSize
        );
      } else if (direction === "down") {
        ctx.fillRect(
          block.x + eyeOffset,
          block.y + eyeOffset,
          eyeSize,
          eyeSize
        );
        ctx.fillRect(
          block.x + blockSize - eyeOffset - eyeSize,
          block.y + eyeOffset,
          eyeSize,
          eyeSize
        );
      }
    } else {
      ctx.fillStyle = "green";
      ctx.fillRect(block.x, block.y, blockSize, blockSize);
    }
  });
}

function drawFood() {
  ctx.drawImage(foodImg, food.x, food.y, blockSize, blockSize);
}

function moveSnake() {
  const head = { x: snake[0].x, y: snake[0].y };

  switch (direction) {
    case "up":
      head.y -= blockSize;
      break;
    case "down":
      head.y += blockSize;
      break;
    case "left":
      head.x -= blockSize;
      break;
    case "right":
      head.x += blockSize;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    const levelScore = 10 * Math.pow(1.2, level - 1);
    score += Math.round(levelScore);

    eatSound.play();
    spawnFood();
  } else {
    snake.pop();
  }
}

function spawnFood() {
  food.x = Math.floor(Math.random() * widthInBlocks) * blockSize;
  food.y = Math.floor(Math.random() * heightInBlocks) * blockSize;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScore();
  levelHTML.innerHTML = `Level: ${level}`;
  drawSnake();
  drawFood();
  moveSnake();
  if (checkCollision()) {
    gameOverSound.play();
    bgMusic.pause();
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }

    gameContainer.classList.add("d-none");
    gameOverContainer.classList.remove("d-none");
    gameOverScore.innerHTML = `Score: ${score}`;
    gameOverHighScore.innerHTML = `High Score: ${highScore}`;

    resetGame();
  } else {
    increaseLevel();

    const delay = 150 / Math.pow(1.2, level - 1);
    setTimeout(gameLoop, delay);
  }
}

restartBtn.addEventListener("click", () => {
  resetGame();
  gameLoop();
  bgMusic.play();
  gameContainer.classList.remove("d-none");
  gameOverContainer.classList.add("d-none");
});

function checkCollision() {
  const head = snake[0];

  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  ) {
    return true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

function resetGame() {
  snake = [{ x: blockSize * 5, y: blockSize * 5 }];
  direction = "right";
  score = 0;
  spawnFood();
  drawScore();
}

startGameBtn.addEventListener("click", () => {
  startScreen.classList.add("d-none");
  gameContainer.classList.remove("d-none");
  bgMusic.play();
  gameLoop();
});

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  switch (key) {
    case "arrowup":
      if (direction !== "down") direction = "up";
      break;
    case "arrowdown":
      if (direction !== "up") direction = "down";
      break;
    case "arrowleft":
      if (direction !== "right") direction = "left";
      break;
    case "arrowright":
      if (direction !== "left") direction = "right";
      break;
  }
});

resetGame();
