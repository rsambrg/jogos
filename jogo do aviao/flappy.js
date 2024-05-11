// Variáveis globais
let canvas, ctx;
let birdX, birdY, birdRadius;
let gravity, jump;
let gap, pipeWidth;
let pipes;
let score;
let birdImg, pipeImg, cloudImg;
let clouds;
let lives;

// Estado do jogo
let isPaused = true;
let gameInterval;

// Função de inicialização do jogo
function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    backgroundImage = new Image();
    backgroundImage.src = "ceu.png"; // Insira o caminho da sua imagem de fundo aqui

    // Carregando imagem do pássaro
    birdImg = new Image();
    birdImg.src = "passaro.png";

    pipeImg = new Image();
    pipeImg.src = "cano.png";

    cloudImg = new Image();
    cloudImg.src = "nuvem.png";



    // Definindo variáveis
    birdX = 50;
    birdY = canvas.height / 2;
    gravity = 0.5;
    jump = -10;
    gap = 120;
    pipeWidth = 50;
    cloudWidth = 60;
    pipes = [];
    clouds = [];
    score = 0;

    // Adicionando evento de teclado
    document.addEventListener("keydown", handleKeyPress);

    // Adicionando eventos de botão
    document.getElementById("playButton").addEventListener("click", playGame);
    document.getElementById("pauseButton").addEventListener("click", pauseGame);


    // Iniciando o loop do jogo
    setInterval(update, 20);
}

// Função para lidar com pressionamento de tecla
function handleKeyPress(event) {
    // Verifica se a tecla pressionada é uma das teclas WASD ou seta para cima
    if (event.key === "w" || event.key === "W" || event.key === "ArrowUp") {
        birdY += jump; // Movimenta o pássaro para cima
    } else if (event.key === "s" || event.key === "S" || event.key === "ArrowDown") {
        birdY -= jump; // Movimenta o pássaro para baixo
    } else if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
        birdX -= 5; // Movimenta o pássaro para a esquerda
    } else if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
        birdX += 5; // Movimenta o pássaro para a direita
    }
}

function createPipes() {
    const minWidth = 50; // Largura mínima do cano
    const maxWidth = 70; // Largura máxima do cano
    const minHeight = 120; // Altura mínima do cano
    const maxHeight = canvas.height - gap - minHeight; // Altura máxima do cano
    const pipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    const pipeWidth = minWidth + (maxWidth - minWidth) * ((pipeHeight - minHeight) / (maxHeight - minHeight));
    const pipeX = canvas.width;
    const pipeY = canvas.height - pipeHeight;

    pipes.push({ x: pipeX, y: pipeY, width: pipeWidth, height: pipeHeight });
}

function createClouds() {
    const cloudWidth = 100; // Defina a largura da nuvem
    const cloudHeight = 50; // Defina a altura da nuvem
    const cloudX = Math.random() * (canvas.width - cloudWidth); // Posição X aleatória dentro da largura do canvas
    const cloudY = Math.random() * (80); // A nuvem sempre começa no topo da tela

    clouds.push({ x: cloudX, y: cloudY, width: cloudWidth, height: cloudHeight });
}



// Função de atualização do jogo
function update() {
    if (!isPaused) {
        // Limpando o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenhando o fundo
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        // Desenhando o pássaro
        ctx.drawImage(birdImg, birdX, birdY, 100, 70);

        // Desenha os canos
        for (let i = 0; i < pipes.length; i++) {
            ctx.drawImage(pipeImg, pipes[i].x, pipes[i].y, pipes[i].width, pipes[i].height);

            // Verifica a colisão com os canos
            const birdCenterX = birdX + 50; // X do centro do pássaro
            const birdCenterY = birdY + 80; // Y do centro do pássaro
            const pipeCenterX = pipes[i].x + pipes[i].width / 2; // X do centro do cano
            const pipeCenterY = pipes[i].y + pipes[i].height / 2; // Y do centro do cano
            const minDistance = 70; // Distância mínima para considerar a colisão

            const distance = Math.sqrt((birdCenterX - pipeCenterX) ** 2 + (birdCenterY - pipeCenterY) ** 2);

            if (distance < minDistance) {
                gameOver();
            }

            // Incrementa a pontuação e remove os canos que já foram passados
            if (pipes[i].x + pipeWidth < birdX && !pipes[i].scored) {
                score++;
                pipes[i].scored = true;
            }

            // Movendo os canos
            pipes[i].x -= 2;
        }

        // Desenha Nuvem
        for (let i = 0; i < clouds.length; i++) {
            ctx.drawImage(cloudImg, clouds[i].x, clouds[i].y, clouds[i].width, clouds[i].height);

            // Verifica a colisão com as nuvens
            if (birdX + 100 >= clouds[i].x &&
                birdX <= clouds[i].x + clouds[i].width &&
                birdY + 100 >= clouds[i].y &&
                birdY <= clouds[i].y + clouds[i].height) {
                gameOver();
            }

            // Movendo Nuvens
            clouds[i].x -= 2;
        }

        // Removendo as nuvens que saíram da tela
        clouds = clouds.filter(cloud => cloud.x + cloudWidth > 0);

        // Gera novas nuvens e canos quando necessário
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - gap * 2) {
            createPipes();
        }

        if (clouds.length === 0 || clouds[clouds.length -1].x < canvas.width - 400 * 3) {
            createClouds();
        }

        // Desenhando a pontuação
        ctx.fillStyle = "r";
        ctx.font = "30px Arial";
        ctx.fillText("Score: " + score, 10, 30);
    }
}


// Função de pausa do jogo
function pauseGame() {
    clearInterval(gameInterval);
    isPaused = true;
    document.getElementById("pauseButton").style.display = "none";
    document.getElementById("playButton").style.display = "inline";
}

// Função de continuação do jogo
function playGame() {
    gameInterval = setInterval(update, 20);
    isPaused = false;
    document.getElementById("playButton").style.display = "none";
    document.getElementById("pauseButton").style.display = "inline";
}


// Função de fim de jogo
function gameOver() {
    clearInterval(gameInterval);
    isPaused = true;
    alert("Você perdeu!");

    location.reload();
}



// Iniciando o jogo ao carregar a página
window.onload = init;
