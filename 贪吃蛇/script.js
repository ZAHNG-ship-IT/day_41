document.addEventListener('DOMContentLoaded', () => {
    // Game canvas setup
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Game variables
    const gridSize = 20;
    const gridWidth = canvas.width / gridSize;
    const gridHeight = canvas.height / gridSize;
    
    let snake = [
        {x: 10, y: 10}
    ];
    let food = {};
    let obstacles = [];
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let gameSpeed = 150; // milliseconds
    let gameInterval;
    let isGameRunning = false;
    let isPaused = false;
    let currentLevel = 1;
    let isAutoPilot = false;
    
    // DOM elements
    const scoreElement = document.getElementById('score');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const levelElement = document.getElementById('level');
    
    // Initialize game
    function initGame() {
        snake = [{x: 10, y: 10}];
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        gameSpeed = 150;
        currentLevel = 1;
        isAutoPilot = false;
        obstacles = [];
        scoreElement.textContent = score;
        levelElement.textContent = currentLevel;
        generateFood();
        drawGame();
    }
    
    // Generate random food position
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
        
        // Make sure food doesn't spawn on snake or obstacles
        const isCollision = checkCollisionWithSnakeOrObstacles(food.x, food.y);
        if (isCollision) {
            generateFood();
        }
    }
    
    // Check if position collides with snake or obstacles
    function checkCollisionWithSnakeOrObstacles(x, y) {
        // Check collision with snake
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === x && snake[i].y === y) {
                return true;
            }
        }
        
        // Check collision with obstacles
        for (let i = 0; i < obstacles.length; i++) {
            if (obstacles[i].x === x && obstacles[i].y === y) {
                return true;
            }
        }
        
        return false;
    }
    
    // Generate obstacles based on level
    function generateObstacles() {
        obstacles = [];
        
        // Number of obstacles based on level
        const obstacleCount = Math.min(currentLevel * 2, 20);
        
        for (let i = 0; i < obstacleCount; i++) {
            const obstacle = {
                x: Math.floor(Math.random() * gridWidth),
                y: Math.floor(Math.random() * gridHeight)
            };
            
            // Make sure obstacles don't spawn on snake or food
            if (checkCollisionWithSnakeOrObstacles(obstacle.x, obstacle.y) || 
                (obstacle.x === food.x && obstacle.y === food.y)) {
                i--; // Try again
                continue;
            }
            
            obstacles.push(obstacle);
        }
    }
    
    // Draw game elements
    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw obstacles
        ctx.fillStyle = '#777';
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize - 1, gridSize - 1);
        });
        
        // Draw snake
        ctx.fillStyle = '#4CAF50';
        snake.forEach((segment, index) => {
            // Make the head a different color
            if (index === 0) {
                ctx.fillStyle = '#45a049';
            } else {
                ctx.fillStyle = '#4CAF50';
            }
            
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        });
        
        // Draw food
        ctx.fillStyle = '#FF5252';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
        
        // Game paused overlay
        if (isPaused && isGameRunning) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('已暂停', canvas.width / 2, canvas.height / 2);
        }
        
        // Auto-pilot indicator
        if (isAutoPilot) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('自动驾驶中', canvas.width / 2, 20);
        }
    }
    
    // Move snake
    function moveSnake() {
        // If autopilot is on, calculate next direction
        if (isAutoPilot) {
            autoPilot();
        }
        
        // Update direction based on nextDirection
        direction = nextDirection;
        
        // Create new head based on current direction
        const head = Object.assign({}, snake[0]);
        
        switch(direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        
        // Check for collision with walls
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
            gameOver();
            return;
        }
        
        // Check for collision with self
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }
        
        // Check for collision with obstacles
        for (let i = 0; i < obstacles.length; i++) {
            if (head.x === obstacles[i].x && head.y === obstacles[i].y) {
                gameOver();
                return;
            }
        }
        
        // Add new head to snake
        snake.unshift(head);
        
        // Check if food was eaten
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score += 10;
            scoreElement.textContent = score;
            
            // Check snake length for level up
            if (snake.length === 15 && currentLevel === 1) {
                levelUp();
            } else if (snake.length === 30 && currentLevel === 2) {
                levelUp();
            } else if (snake.length === 45 && currentLevel === 3) {
                levelUp();
            } else if (snake.length === 60 && currentLevel === 4) {
                levelUp();
            } else if (snake.length === 75 && currentLevel === 5) {
                levelUp();
            } else if (snake.length === 90 && currentLevel === 6) {
                levelUp();
            } else if (snake.length === 105 && currentLevel === 7) {
                levelUp();
            } else if (snake.length === 120 && currentLevel === 8) {
                levelUp();
            } else if (snake.length === 135 && currentLevel === 9) {
                levelUp();
            }
            
            // Speed up the game slightly
            if (gameSpeed > 50) {
                gameSpeed -= 1;
                resetGameInterval();
            }
            
            // Generate new food
            generateFood();
        } else {
            // Remove tail if no food was eaten
            snake.pop();
        }
    }
    
    // Level up
    function levelUp() {
        currentLevel++;
        levelElement.textContent = currentLevel;
        
        // Display level up message
        displayMessage(`难度提升至 ${currentLevel} 级!`);
        
        // Generate new obstacles on level up
        generateObstacles();
        
        // Speed up game by decreasing interval
        gameSpeed = Math.max(50, gameSpeed - 10);
        resetGameInterval();
        
        // Enable autopilot at level 10
        if (currentLevel === 10) {
            isAutoPilot = true;
            displayMessage("已启动托管模式!", 3000);
        }
    }
    
    // Display message on canvas
    function displayMessage(message, duration = 2000) {
        const messageElement = document.createElement('div');
        messageElement.className = 'game-message';
        messageElement.textContent = message;
        document.querySelector('.game-container').appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                messageElement.remove();
            }, 500);
        }, duration);
    }
    
    // Auto-pilot logic
    function autoPilot() {
        // Simple algorithm to find path to food
        const head = snake[0];
        
        // Determine possible moves (excluding those that would cause immediate death)
        const possibleMoves = [];
        
        // Check up
        if (direction !== 'down' && !wouldCollide(head.x, head.y - 1)) {
            possibleMoves.push('up');
        }
        
        // Check down
        if (direction !== 'up' && !wouldCollide(head.x, head.y + 1)) {
            possibleMoves.push('down');
        }
        
        // Check left
        if (direction !== 'right' && !wouldCollide(head.x - 1, head.y)) {
            possibleMoves.push('left');
        }
        
        // Check right
        if (direction !== 'left' && !wouldCollide(head.x + 1, head.y)) {
            possibleMoves.push('right');
        }
        
        // If no safe moves, continue with current direction
        if (possibleMoves.length === 0) {
            return;
        }
        
        // Prefer moves that get closer to food
        const distances = possibleMoves.map(move => {
            let x = head.x;
            let y = head.y;
            
            switch(move) {
                case 'up': y--; break;
                case 'down': y++; break;
                case 'left': x--; break;
                case 'right': x++; break;
            }
            
            // Calculate Manhattan distance to food
            return {
                move: move,
                distance: Math.abs(x - food.x) + Math.abs(y - food.y)
            };
        });
        
        // Sort by distance (closest first)
        distances.sort((a, b) => a.distance - b.distance);
        
        // Choose the best move (closest to food)
        nextDirection = distances[0].move;
    }
    
    // Check if moving to a position would cause collision
    function wouldCollide(x, y) {
        // Check walls
        if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) {
            return true;
        }
        
        // Check snake body (excluding tail that will move)
        for (let i = 0; i < snake.length - 1; i++) {
            if (snake[i].x === x && snake[i].y === y) {
                return true;
            }
        }
        
        // Check obstacles
        for (let i = 0; i < obstacles.length; i++) {
            if (obstacles[i].x === x && obstacles[i].y === y) {
                return true;
            }
        }
        
        return false;
    }
    
    // Game loop
    function gameLoop() {
        if (!isPaused) {
            moveSnake();
            drawGame();
        }
    }
    
    // Start game
    function startGame() {
        if (!isGameRunning) {
            initGame();
            isGameRunning = true;
            isPaused = false;
            startBtn.textContent = '重新开始';
            pauseBtn.disabled = false;
            resetGameInterval();
        } else {
            // If game is already running, restart it
            clearInterval(gameInterval);
            initGame();
            isPaused = false;
            pauseBtn.textContent = '暂停';
            resetGameInterval();
        }
    }
    
    // Reset game interval
    function resetGameInterval() {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
    
    // Pause game
    function togglePause() {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? '继续' : '暂停';
        drawGame();
    }
    
    // Game over
    function gameOver() {
        clearInterval(gameInterval);
        isGameRunning = false;
        
        // Display game over
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.font = '20px Arial';
        ctx.fillText(`最终得分: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText(`最终难度: ${currentLevel}`, canvas.width / 2, canvas.height / 2 + 40);
        ctx.fillText('点击"开始游戏"重新开始', canvas.width / 2, canvas.height / 2 + 70);
        
        startBtn.textContent = '开始游戏';
        pauseBtn.disabled = true;
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    pauseBtn.disabled = true;
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        // Prevent default behavior for arrow keys
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            e.preventDefault();
        }
        
        // Don't process input if in autopilot
        if (isAutoPilot) return;
        
        // Change direction based on key press
        // Don't allow 180-degree turns
        switch(e.code) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
            case 'Space':
                if (isGameRunning) togglePause();
                break;
        }
    });
    
    // Touch controls for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, false);
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, false);
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        
        if (!isGameRunning || isAutoPilot) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Determine swipe direction based on which delta is larger
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0 && direction !== 'left') {
                nextDirection = 'right';
            } else if (deltaX < 0 && direction !== 'right') {
                nextDirection = 'left';
            }
        } else {
            // Vertical swipe
            if (deltaY > 0 && direction !== 'up') {
                nextDirection = 'down';
            } else if (deltaY < 0 && direction !== 'down') {
                nextDirection = 'up';
            }
        }
    }, false);
    
    // Initial draw
    drawGame();
}); 