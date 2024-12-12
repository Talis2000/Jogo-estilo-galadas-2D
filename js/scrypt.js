// Variáveis Globais
let player, bullets, enemies, score, lives, difficulty;
let gameInterval, playerName;

// Inicializar Jogo
function startGame() {
    playerName = document.getElementById('playerName').value || 'Jogador';
    difficulty = document.getElementById('difficulty').value;
    setupGame();
    startGameLoop();
    hideMenu();
}

// Configurações Iniciais
function setupGame() {
    score = 0;
    lives = 3;
    player = { x: 400, y: 500, width: 50, height: 50, speed: 5, dx: 0 };
    bullets = [];
    enemies = [];
    enemySpeed = difficulty === 'easy' ? 1 : (difficulty === 'medium' ? 2 : 3);

    const canvas = document.getElementById("gameCanvas");
    canvas.width = 800;
    canvas.height = 600;
    canvas.style.display = 'block';
}

// Loop Principal do Jogo
function startGameLoop() {
    gameInterval = setInterval(update, 16); // Aproximadamente 60 FPS
}

// Atualizar Jogo
function update() {
    drawBackground();
    movePlayer();
    drawPlayer();
    moveBullets();
    drawBullets();
    createEnemies();
    drawEnemies();
    checkCollisions();
    checkGameOver();
}

// Funções de Jogo
function drawBackground() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > 800) player.x = 800 - player.width;
}

function drawPlayer() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function moveBullets() {
    bullets.forEach(bullet => bullet.y -= 5);
    bullets = bullets.filter(bullet => bullet.y > 0);
}

function drawBullets() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, 5, 10));
}

function createEnemies() {
    if (Math.random() < 0.02) {
        let x = Math.random() * 750;
        enemies.push({ x, y: 0, width: 50, height: 50, speed: enemySpeed });
    }
}

function drawEnemies() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    enemies.forEach(enemy => {
        enemy.y += enemy.speed;
        ctx.fillStyle = "green";
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
    enemies = enemies.filter(enemy => enemy.y < 600);
}

function checkCollisions() {
    bullets.forEach((bullet, i) => {
        enemies.forEach((enemy, j) => {
            if (bullet.x < enemy.x + enemy.width && bullet.x + 5 > enemy.x && bullet.y < enemy.y + enemy.height && bullet.y + 10 > enemy.y) {
                score += 10;
                bullets.splice(i, 1);
                enemies.splice(j, 1);
            }
        });
    });
}

function checkGameOver() {
    enemies.forEach(enemy => {
        if (enemy.x < player.x + player.width && enemy.x + enemy.width > player.x && enemy.y < player.y + player.height && enemy.y + enemy.height > player.y) {
            lives--;
            enemies = enemies.filter(e => e !== enemy);
            if (lives <= 0) {
                clearInterval(gameInterval);
                alert('Game Over! Pontuação: ' + score);
                saveRecord();
                showMenu();
            }
        }
    });
}

// Funções de Controle do Jogo
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") player.dx = -player.speed;
    if (e.key === "ArrowRight") player.dx = player.speed;
    if (e.key === " ") bullets.push({ x: player.x + 22, y: player.y, width: 5, height: 10 });
});

document.addEventListener('keyup', (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
});

// Funções do Menu
function showMenu() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('scoreboard').style.display = 'none';
    document.getElementById('records').style.display = 'none';
}

function hideMenu() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('scoreboard').style.display = 'block';
}

function showRecords() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('records').style.display = 'block';
    loadRecords();
}

// Função para salvar e carregar recordes
function saveRecord() {
    let records = JSON.parse(localStorage.getItem('records')) || [];
    records.push({ name: playerName, score });
    records = records.sort((a, b) => b.score - a.score).slice(0, 5);
    localStorage.setItem('records', JSON.stringify(records));
}

function loadRecords() {
    const records = JSON.parse(localStorage.getItem('records')) || [];
    const recordsList = document.getElementById('recordsList');
    recordsList.innerHTML = records.map(r => `<li>${r.name}: ${r.score}</li>`).join('');
}

// Iniciar o Jogo ao clicar no botão
document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('viewRecords').addEventListener('click', showRecords);
document.getElementById('backToMenu').addEventListener('click', showMenu);
