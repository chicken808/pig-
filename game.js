const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
let gameRunning = false;
let gameTime = 300; // 5 minutes in seconds
let homeScore = 0;
let awayScore = 0;
let homeStats = { attempts: 0, made: 0 };
let awayStats = { attempts: 0, made: 0 };

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    vx: 0,
    vy: 0,
    inHand: null
};

// Players
const homePlayer = {
    x: 100,
    y: canvas.height / 2,
    radius: 15,
    vx: 0,
    vy: 0,
    speed: 4,
    shooting: false,
    hasBall: true
};

const awayPlayer = {
    x: canvas.width - 100,
    y: canvas.height / 2,
    radius: 15,
    vx: 0,
    vy: 0,
    speed: 4,
    shooting: false,
    hasBall: false
};

// Baskets
const homeBasket = {
    x: canvas.width - 80,
    y: 80,
    width: 40,
    height: 10
};

const awayBasket = {
    x: 80,
    y: 80,
    width: 40,
    height: 10
};

// Input handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Game Control
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('resetBtn').addEventListener('click', resetGame);

function startGame() {
    gameRunning = true;
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'inline-block';
    gameTime = 300;
    homeScore = 0;
    awayScore = 0;
    homeStats = { attempts: 0, made: 0 };
    awayStats = { attempts: 0, made: 0 };
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 0;
    ball.vy = 0;
    homePlayer.x = 100;
    homePlayer.y = canvas.height / 2;
    homePlayer.hasBall = true;
    awayPlayer.x = canvas.width - 100;
    awayPlayer.y = canvas.height / 2;
    awayPlayer.hasBall = false;
}

function resetGame() {
    gameRunning = false;
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('gameStatus').textContent = '';
}

function updateTimer() {
    if (gameRunning && gameTime > 0) {
        gameTime--;
    } else if (gameTime === 0 && gameRunning) {
        gameRunning = false;
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('resetBtn').style.display = 'none';
        const winner = homeScore > awayScore ? 'HOME' : awayScore > homeScore ? 'AWAY' : 'TIE';
        document.getElementById('gameStatus').textContent = `GAME OVER! ${winner} WINS!`;
    }
    
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    document.getElementById('gameTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function handlePlayerInput() {
    // Home Player (Arrow Keys + Space)
    homePlayer.vx = 0;
    homePlayer.vy = 0;
    if (keys['ArrowUp']) homePlayer.vy = -homePlayer.speed;
    if (keys['ArrowDown']) homePlayer.vy = homePlayer.speed;
    if (keys['ArrowLeft']) homePlayer.vx = -homePlayer.speed;
    if (keys['ArrowRight']) homePlayer.vx = homePlayer.speed;
    if (keys[' ']) homePlayer.shooting = true;
    
    // Away Player (WASD + X)
    awayPlayer.vx = 0;
    awayPlayer.vy = 0;
    if (keys['w'] || keys['W']) awayPlayer.vy = -awayPlayer.speed;
    if (keys['s'] || keys['S']) awayPlayer.vy = awayPlayer.speed;
    if (keys['a'] || keys['A']) awayPlayer.vx = -awayPlayer.speed;
    if (keys['d'] || keys['D']) awayPlayer.vx = awayPlayer.speed;
    if (keys['x'] || keys['X']) awayPlayer.shooting = true;
}

function updatePlayers() {
    // Home Player
    homePlayer.x += homePlayer.vx;
    homePlayer.y += homePlayer.vy;
    homePlayer.x = Math.max(homePlayer.radius, Math.min(canvas.width - homePlayer.radius, homePlayer.x));
    homePlayer.y = Math.max(homePlayer.radius, Math.min(canvas.height - homePlayer.radius, homePlayer.y));
    
    // Away Player
    awayPlayer.x += awayPlayer.vx;
    awayPlayer.y += awayPlayer.vy;
    awayPlayer.x = Math.max(awayPlayer.radius, Math.min(canvas.width - awayPlayer.radius, awayPlayer.x));
    awayPlayer.y = Math.max(awayPlayer.radius, Math.min(canvas.height - awayPlayer.radius, awayPlayer.y));
}

function updateBall() {
    if (ball.inHand === null) {
        // Physics
        ball.vy += 0.3; // Gravity
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        // Friction
        ball.vx *= 0.98;
        ball.vy *= 0.98;
        
        // Walls
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            ball.vx = -ball.vx * 0.7;
            ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x));
        }
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.vy = -ball.vy * 0.7;
            ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
        }
    }
    
    // Ball catching
    const distHome = Math.hypot(ball.x - homePlayer.x, ball.y - homePlayer.y);
    const distAway = Math.hypot(ball.x - awayPlayer.x, ball.y - awayPlayer.y);
    
    if (distHome < homePlayer.radius + ball.radius + 5) {
        ball.inHand = 'home';
        homePlayer.hasBall = true;
        awayPlayer.hasBall = false;
    } else if (distAway < awayPlayer.radius + ball.radius + 5) {
        ball.inHand = 'away';
        awayPlayer.hasBall = true;
        homePlayer.hasBall = false;
    }
    
    if (ball.inHand === 'home') {
        ball.x = homePlayer.x;
        ball.y = homePlayer.y;
    } else if (ball.inHand === 'away') {
        ball.x = awayPlayer.x;
        ball.y = awayPlayer.y;
    }
}

function handleShooting() {
    if (homePlayer.shooting && homePlayer.hasBall) {
        homeStats.attempts++;
        const angle = Math.atan2(homeBasket.y - homePlayer.y, homeBasket.x - homePlayer.x);
        ball.vx = Math.cos(angle) * 8;
        ball.vy = Math.sin(angle) * 8;
        ball.inHand = null;
        homePlayer.hasBall = false;
        homePlayer.shooting = false;
    }
    if (awayPlayer.shooting && awayPlayer.hasBall) {
        awayStats.attempts++;
        const angle = Math.atan2(awayBasket.y - awayPlayer.y, awayBasket.x - awayPlayer.x);
        ball.vx = Math.cos(angle) * 8;
        ball.vy = Math.sin(angle) * 8;
        ball.inHand = null;
        awayPlayer.hasBall = false;
        awayPlayer.shooting = false;
    }
}

function checkBaskets() {
    // Home basket
    if (ball.x > homeBasket.x && ball.x < homeBasket.x + homeBasket.width &&
        ball.y > homeBasket.y && ball.y < homeBasket.y + homeBasket.height &&
        Math.hypot(ball.vx, ball.vy) > 2) {
        awayScore += 2;
        awayStats.made++;
        resetBall();
        document.getElementById('gameStatus').textContent = '🎯 AWAY TEAM SCORES!';
        setTimeout(() => { document.getElementById('gameStatus').textContent = ''; }, 1500);
    }
    
    // Away basket
    if (ball.x > awayBasket.x && ball.x < awayBasket.x + awayBasket.width &&
        ball.y > awayBasket.y && ball.y < awayBasket.y + awayBasket.height &&
        Math.hypot(ball.vx, ball.vy) > 2) {
        homeScore += 2;
        homeStats.made++;
        resetBall();
        document.getElementById('gameStatus').textContent = '🎯 HOME TEAM SCORES!';
        setTimeout(() => { document.getElementById('gameStatus').textContent = ''; }, 1500);
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 0;
    ball.vy = 0;
    ball.inHand = null;
    homePlayer.hasBall = true;
    homePlayer.x = 100;
    homePlayer.y = canvas.height / 2;
}

function updateStats() {
    const homeFGP = homeStats.attempts > 0 ? Math.round((homeStats.made / homeStats.attempts) * 100) : 0;
    const awayFGP = awayStats.attempts > 0 ? Math.round((awayStats.made / awayStats.attempts) * 100) : 0;
    
    document.getElementById('homeScore').textContent = homeScore;
    document.getElementById('awayScore').textContent = awayScore;
    document.getElementById('homeFG').textContent = `${homeStats.made}/${homeStats.attempts}`;
    document.getElementById('homeFGP').textContent = `${homeFGP}%`;
    document.getElementById('awayFG').textContent = `${awayStats.made}/${awayStats.attempts}`;
    document.getElementById('awayFGP').textContent = `${awayFGP}%`;
}

function draw() {
    // Clear canvas
    ctx.fillStyle = 'rgba(135, 206, 235, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw court lines
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    
    // Center line
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Three-point lines (simplified)
    ctx.strokeRect(50, 40, 150, 150);
    ctx.strokeRect(canvas.width - 200, 40, 150, 150);
    
    // Baskets
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(homeBasket.x, homeBasket.y, homeBasket.width, homeBasket.height);
    ctx.fillRect(awayBasket.x, awayBasket.y, awayBasket.width, awayBasket.height);
    
    // Backboards
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(homeBasket.x - 5, homeBasket.y - 30, homeBasket.width + 10, 30);
    ctx.strokeRect(awayBasket.x - 5, awayBasket.y - 30, awayBasket.width + 10, 30);
    
    // Home Player
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.arc(homePlayer.x, homePlayer.y, homePlayer.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', homePlayer.x, homePlayer.y);
    
    // Away Player
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.arc(awayPlayer.x, awayPlayer.y, awayPlayer.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText('A', awayPlayer.x, awayPlayer.y);
    
    // Ball
    ctx.fillStyle = '#FF8800';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function update() {
    if (gameRunning) {
        handlePlayerInput();
        updatePlayers();
        updateBall();
        handleShooting();
        checkBaskets();
    }
    updateTimer();
    updateStats();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();