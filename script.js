const board = document.getElementById('gameBoard');
const rows = Array.from(document.querySelectorAll('.button-row'));
const latestLog = document.getElementById('latestLog');
const stats = document.getElementById('stats');
const nextTarget = document.getElementById('nextTarget');
const attemptCounter = document.getElementById('attemptCounter');
const timer = document.getElementById('timer');
const result = document.getElementById('result');
const resultDetails = document.getElementById('resultDetails');
const restartButton = document.getElementById('restartButton');

const TOTAL_BUTTONS = 9;
const BUTTON_SIZE = 64;
const DEFAULT_LOG_TEXT = 'Click anywhere to show screenX / screenY';

let currentTarget = 1;
let attempts = 0;
let startedAt = 0;
let elapsedSeconds = 0;
let completed = false;
let timerId = null;

function setText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function formatTimestamp(date) {
  const pad = (value, length = 2) => String(value).padStart(length, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = pad(date.getMilliseconds(), 3);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function writeClickLog(event) {
  setText(latestLog, `screenX: ${event.screenX}, screenY: ${event.screenY}, ${formatTimestamp(new Date())}`);
}

function updateStatus() {
  setText(stats, `Attempts: ${attempts}`);
  setText(attemptCounter, `Total attempts: ${attempts}`);
  setText(nextTarget, completed ? 'Complete' : `Next: ${currentTarget}`);
  setText(timer, `Elapsed: ${elapsedSeconds.toFixed(2)}s`);

  document.querySelectorAll('.target-button').forEach((button) => {
    button.classList.toggle('next', Number(button.dataset.number) === currentTarget && !completed);
  });
}

function startTimer() {
  clearInterval(timerId);
  startedAt = performance.now();
  elapsedSeconds = 0;
  timerId = setInterval(() => {
    if (!completed) {
      elapsedSeconds = (performance.now() - startedAt) / 1000;
      updateStatus();
    }
  }, 50);
}

function getButtonSize() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--button-size').trim();
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : BUTTON_SIZE;
}

function placeButtonsRandomly() {
  const buttonSize = getButtonSize();

  rows.forEach((row, rowIndex) => {
    row.replaceChildren();
    const rowWidth = row.clientWidth;
    const rowHeight = row.clientHeight;
    const segmentWidth = rowWidth / 3;
    const numbers = [rowIndex * 3 + 1, rowIndex * 3 + 2, rowIndex * 3 + 3];

    numbers.forEach((number, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'target-button';
      button.dataset.number = String(number);
      button.textContent = number;
      button.setAttribute('aria-label', `Button ${number}`);

      const segmentStart = segmentWidth * index;
      const minLeft = segmentStart + 8;
      const maxLeft = Math.max(minLeft, segmentStart + segmentWidth - buttonSize - 8);
      const maxTop = Math.max(8, rowHeight - buttonSize - 8);

      button.style.left = `${randomBetween(minLeft, maxLeft)}px`;
      button.style.top = `${randomBetween(8, maxTop)}px`;

      row.appendChild(button);
    });
  });
}

function completeTask() {
  completed = true;
  clearInterval(timerId);
  elapsedSeconds = (performance.now() - startedAt) / 1000;

  if (result) {
    result.hidden = false;
  }

  setText(resultDetails, `Elapsed time: ${elapsedSeconds.toFixed(2)} seconds. Total attempts: ${attempts}.`);
  updateStatus();
}

function markWrongClick(button) {
  if (!button) return;
  button.classList.remove('wrong');
  window.requestAnimationFrame(() => {
    button.classList.add('wrong');
  });
}

function handleBoardClick(event) {
  if (completed) return;

  attempts += 1;
  const button = event.target.closest('.target-button');

  if (!button) {
    updateStatus();
    return;
  }

  const clickedNumber = Number(button.dataset.number);

  if (clickedNumber === currentTarget) {
    button.classList.add('completed');
    button.disabled = true;
    button.textContent = '✓';
    currentTarget += 1;

    if (currentTarget > TOTAL_BUTTONS) {
      completeTask();
      return;
    }
  } else {
    markWrongClick(button);
  }

  updateStatus();
}

function resetGame() {
  currentTarget = 1;
  attempts = 0;
  completed = false;

  if (result) {
    result.hidden = true;
  }

  setText(latestLog, DEFAULT_LOG_TEXT);
  placeButtonsRandomly();
  startTimer();
  updateStatus();
}

document.addEventListener('click', writeClickLog, true);

if (board) {
  board.addEventListener('click', handleBoardClick);
}

if (restartButton) {
  restartButton.addEventListener('click', resetGame);
}

window.addEventListener('resize', () => {
  if (!completed) {
    placeButtonsRandomly();
    updateStatus();
  }
});

resetGame();
