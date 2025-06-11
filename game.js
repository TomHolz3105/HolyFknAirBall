// �️ GAME SETUP
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const holyMessage = document.getElementById('holy-message');

// 🔥 CONFIG
const DIFFICULTY = 100; // 1/100 Bälle gehen rein
const HOLY_CHANCE = 200; // 1/200 für HolyFknAirball
let coins = 0;
let attempts = 0;
let ball = null;

// 🎯 GAME OBJECTS
const player = {
  x: 100,
  y: 350,
  width: 50,
  height: 80
};

const hoop = {
  x: 600,
  y: 150,
  width: 60,
  height: 5,
  netDirection: -1 // -1 = Korb zeigt nach LINKS
};

// 🎮 GAME FUNCTIONS
function throwBall() {
  attempts++;
  document.getElementById('attempts').textContent = attempts;

  const isNormalScore = Math.random() * DIFFICULTY < 1;
  const isHolyBall = Math.random() * HOLY_CHANCE < 1;

  ball = {
    x: player.x + 30,
    y: player.y - 10,
    dx: 7 + Math.random() * 3,
    dy: -10,
    radius: 12,
    color: isHolyBall ? 'gold' : '#FF6B00',
    isHoly: isHolyBall,
    isScoring: isNormalScore && !isHolyBall
  };

  if (isHolyBall) {
    coins += 1000;
    updateUI();
    showHolyMessage();
  }
}

function updateBall() {
  if (ball) {
    ball.x += ball.dx;
    ball.y += ball.dy;
    ball.dy += 0.3; // Schwerkraft

    // 🔥 HolyFknAirball fliegt aus dem Bildschirm
    if (ball.isHoly && (ball.x > canvas.width + 100 || ball.y < -100)) {
      ball = null;
      return;
    }

    // 🎯 Korb-Kollision (IMMER treffen, aber nur 1/100 geht rein)
    if (
      ball.x > hoop.x && 
      ball.x < hoop.x + hoop.width && 
      ball.y > hoop.y && 
      ball.y < hoop.y + hoop.height
    ) {
      if (ball.isScoring) {
        coins += 1;
        updateUI();
      }
      ball = null;
    }

    if (ball && ball.y > canvas.height + 50) ball = null;
  }
}

// ✨ RENDERING
function drawPlayer() {
  // Körper (rotes Trikot mit Nummer 23)
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(player.x, player.y - 10, player.width, 40);

  // Nummer 23
  ctx.fillStyle = 'white';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('23', player.x + 25, player.y + 15);

  // Kopf (braun)
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.arc(player.x + 25, player.y - 15, 15, 0, Math.PI * 2);
  ctx.fill();

  // Hose (schwarz)
  ctx.fillStyle = '#000';
  ctx.fillRect(player.x, player.y + 30, player.width, 40);
}

function drawHoop() {
  // Backboard (weiß, unverändert)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(hoop.x - 10, hoop.y - 50, 10, 60);

  // 🔥 ORANGER HORIZONTALER BALKEN (vorher schwarz/rot)
  ctx.fillStyle = '#FFA500'; // Knallorange
  ctx.fillRect(hoop.x, hoop.y, hoop.width, hoop.height); // Horizontaler Balken
}

function drawBall() {
  if (ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // HolyFknAirball Glow
    if (ball.isHoly) {
      ctx.shadowColor = 'gold';
      ctx.shadowBlur = 20;
    } else {
      ctx.shadowBlur = 0;
    }
  }
}

// 💎 UI & HELPER
function updateUI() {
  document.getElementById('coin-count').textContent = coins;
  localStorage.setItem('HFNA_coins', coins);
}

function showHolyMessage() {
  holyMessage.classList.add('show');
  setTimeout(() => holyMessage.classList.remove('show'), 3000);
}

// 🎮 START GAME
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  updateBall();
  drawPlayer();
  drawHoop();
  drawBall();
  
  requestAnimationFrame(gameLoop);
}

// 🖱️ EVENT LISTENER
canvas.addEventListener('click', throwBall);
document.getElementById('connect-wallet').addEventListener('click', () => {
  alert("Imagine connecting a wallet... 😂");
});

// 🚀 INIT
gameLoop();