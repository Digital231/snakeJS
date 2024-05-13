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
//load images
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
      // Draw snake head
      ctx.fillStyle = "green";
      ctx.fillRect(block.x, block.y, blockSize, blockSize);

      // Draw eyes
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
      // Draw snake body
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
    const levelScore = 10 * Math.pow(1.2, level - 1); // Increase score by 20% per level
    score += Math.round(levelScore);
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
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the score and high score
  drawScore();

  // Draw the level
  levelHTML.innerHTML = `Level: ${level}`;

  // Draw the snake
  drawSnake();

  // Draw the food
  drawFood();

  // Move the snake
  moveSnake();

  // Check for collision
  if (checkCollision()) {
    // Update the high score if the current score is higher
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }

    // Show the game over screen
    gameContainer.classList.add("d-none");
    gameOverContainer.classList.remove("d-none");
    gameOverScore.innerHTML = `Score: ${score}`;
    gameOverHighScore.innerHTML = `High Score: ${highScore}`;

    // Reset the game
    resetGame();
  } else {
    // Increase level if necessary
    increaseLevel();

    // Continue the game loop
    const delay = 150 / Math.pow(1.2, level - 1); // Decrease delay by 20% per level
    setTimeout(gameLoop, delay);
  }
}

restartBtn.addEventListener("click", () => {
  resetGame();
  gameLoop();
  gameContainer.classList.remove("d-none");
  gameOverContainer.classList.add("d-none");
});

function checkCollision() {
  const head = snake[0];

  // Check collision with walls
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  ) {
    return true;
  }

  // Check collision with snake body
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
  drawScore(); // Ensure score is reset on screen
}

startGameBtn.addEventListener("click", () => {
  startScreen.classList.add("d-none");
  gameContainer.classList.remove("d-none");
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
