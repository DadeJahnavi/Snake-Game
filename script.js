const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
const rows = canvas.height / box;
const cols = canvas.width / box;

let snake;
let apple;
let goldenApple = null;
let dx, dy;
let score;
let redApplesEaten;
let gameInterval;

const startBtn = document.getElementById("startBtn");
const scoreText = document.getElementById("score");
const messageText = document.getElementById("message");

function init() {
  snake = [{ x: 10 * box, y: 10 * box }];
  dx = box;
  dy = 0;
  score = 0;
  redApplesEaten = 0;
  goldenApple = null;
  placeApple();
  clearInterval(gameInterval);
  gameInterval = setInterval(draw, 150);
  messageText.textContent = "";
  updateScore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw apple(s)
  ctx.fillStyle = goldenApple ? "#FFD700" : "red";
  const currentApple = goldenApple || apple;
  ctx.fillRect(currentApple.x, currentApple.y, box, box);

  // Draw snake
  ctx.fillStyle = "#00FF88";
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Check wall collision
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height
  ) return gameOver();

  // Check self collision
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y)
      return gameOver();
  }

  snake.unshift(head);

  if (head.x === currentApple.x && head.y === currentApple.y) {
    score += goldenApple ? 10 : 1;
    redApplesEaten += goldenApple ? 0 : 1;
    goldenApple = null;

    if (redApplesEaten >= 20 && !goldenApple) {
      placeGoldenApple();
    } else {
      placeApple();
    }
    updateScore();

    if (redApplesEaten >= 20 && !goldenApple) {
      messageText.textContent = "Golden apple has appeared!";
    }

    if (goldenApple && head.x === goldenApple.x && head.y === goldenApple.y) {
      winGame();
    }
  } else {
    snake.pop();
  }
}

function gameOver() {
  clearInterval(gameInterval);
  messageText.textContent = "Game Over 💀";
}

function winGame() {
  clearInterval(gameInterval);
  messageText.textContent = "You Win! 🎉";
}

function placeApple() {
  apple = {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box,
  };
}

function placeGoldenApple() {
  goldenApple = {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box,
  };
}

function updateScore() {
  scoreText.textContent = "Score: " + score;
}

document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key === "ArrowUp" && dy === 0) {
    dx = 0;
    dy = -box;
  } else if (key === "ArrowDown" && dy === 0) {
    dx = 0;
    dy = box;
  } else if (key === "ArrowLeft" && dx === 0) {
    dx = -box;
    dy = 0;
  } else if (key === "ArrowRight" && dx === 0) {
    dx = box;
    dy = 0;
  }
});

startBtn.addEventListener("click", init);
