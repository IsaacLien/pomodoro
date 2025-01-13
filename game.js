class FlappyGame {
    constructor() {
        console.log('Game initializing...'); // Debug log
        this.canvas = document.getElementById('gameCanvas');
        
        // Check if canvas exists
        if (!this.canvas) {
            console.error('Game canvas not found!');
            return;
        }
        
        console.log('Canvas found, setting up context...');
        this.ctx = this.canvas.getContext('2d');
        
        // Make canvas more visible for debugging
        this.canvas.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.canvas.style.border = '2px solid #ff00ff';
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = 150;

        // Bird properties
        this.bird = {
            x: 50,
            y: 75,
            velocity: 0,
            size: 20
        };

        // Obstacle properties
        this.obstacles = [];
        this.obstacleWidth = 50;
        this.gapHeight = 60;
        this.obstacleSpeed = 2;
        this.obstacleInterval = 2000; // New obstacle every 2 seconds
        this.lastObstacleTime = 0;

        // Game state
        this.score = 0;
        this.gameOver = false;
        this.isPlaying = false;

        // Physics
        this.gravity = 0.5;
        this.jumpForce = -8;

        // Colors (Vegas theme)
        this.colors = ['#ff00ff', '#ffff00', '#00ffff', '#ff0000'];
        this.currentColorIndex = 0;
        setInterval(() => {
            this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
        }, 1000);

        // Event listeners
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent page scrolling
                if (!this.isPlaying) {
                    this.start();
                }
                this.jump();
            }
        });

        // Immediately draw something to verify canvas is working
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawStartScreen();
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
    }

    start() {
        this.isPlaying = true;
        this.gameOver = false;
        this.score = 0;
        this.obstacles = [];
        this.bird.y = 75;
        this.bird.velocity = 0;
        this.animate();
    }

    jump() {
        this.bird.velocity = this.jumpForce;
    }

    createObstacle() {
        const minHeight = 20;
        const maxHeight = this.canvas.height - this.gapHeight - 20;
        const height = Math.random() * (maxHeight - minHeight) + minHeight;

        return {
            x: this.canvas.width,
            height: height,
            passed: false
        };
    }

    drawStartScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.colors[this.currentColorIndex];
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Press SPACE to start', this.canvas.width / 2 - 80, this.canvas.height / 2);
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw bird
        this.ctx.fillStyle = this.colors[this.currentColorIndex];
        this.ctx.fillRect(this.bird.x, this.bird.y, this.bird.size, this.bird.size);

        // Draw obstacles
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = this.colors[this.currentColorIndex];
            // Draw top obstacle
            this.ctx.fillRect(obstacle.x, 0, this.obstacleWidth, obstacle.height);
            // Draw bottom obstacle
            this.ctx.fillRect(
                obstacle.x,
                obstacle.height + this.gapHeight,
                this.obstacleWidth,
                this.canvas.height - (obstacle.height + this.gapHeight)
            );
        });

        // Draw score
        this.ctx.fillStyle = this.colors[this.currentColorIndex];
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);

        if (this.gameOver) {
            this.ctx.fillStyle = this.colors[this.currentColorIndex];
            this.ctx.font = '40px Arial';
            this.ctx.fillText('Game Over!', this.canvas.width / 2 - 100, this.canvas.height / 2);
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Press SPACE to restart', this.canvas.width / 2 - 80, this.canvas.height / 2 + 40);
        }
    }

    update() {
        if (this.gameOver) return;

        // Update bird
        this.bird.velocity += this.gravity;
        this.bird.y += this.bird.velocity;

        // Check collisions with canvas boundaries
        if (this.bird.y < 0 || this.bird.y + this.bird.size > this.canvas.height) {
            this.gameOver = true;
            this.isPlaying = false;
            return;
        }

        // Create new obstacles
        const currentTime = Date.now();
        if (currentTime - this.lastObstacleTime > this.obstacleInterval) {
            this.obstacles.push(this.createObstacle());
            this.lastObstacleTime = currentTime;
        }

        // Update obstacles
        this.obstacles.forEach(obstacle => {
            obstacle.x -= this.obstacleSpeed;

            // Check for collision
            if (
                this.bird.x + this.bird.size > obstacle.x &&
                this.bird.x < obstacle.x + this.obstacleWidth &&
                (this.bird.y < obstacle.height || 
                 this.bird.y + this.bird.size > obstacle.height + this.gapHeight)
            ) {
                this.gameOver = true;
                this.isPlaying = false;
            }

            // Update score
            if (!obstacle.passed && this.bird.x > obstacle.x + this.obstacleWidth) {
                obstacle.passed = true;
                this.score++;
            }
        });

        // Remove off-screen obstacles
        this.obstacles = this.obstacles.filter(obstacle => obstacle.x + this.obstacleWidth > 0);
    }

    animate() {
        if (!this.isPlaying) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Wait for DOM to load before initializing game
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating game...');
    const game = new FlappyGame();
}); 