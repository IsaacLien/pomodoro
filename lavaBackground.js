class LavaBackground {
    constructor() {
        this.canvas = document.getElementById('lavaCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.points = [];
        this.numberOfPoints = 50;
        this.createPoints();
        this.colors = ['#ff00ff', '#ffff00', '#00ffff', '#ff0000'];
        this.currentColorIndex = 0;
        setInterval(() => {
            this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
        }, 1000);
        this.animate();
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let point of this.points) {
            point.x += point.speedX;
            point.y += point.speedY;

            if (point.x < 0 || point.x > this.canvas.width) point.speedX *= -1;
            if (point.y < 0 || point.y > this.canvas.height) point.speedY *= -1;

            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = this.colors[this.currentColorIndex];
            this.ctx.fill();

            for (let otherPoint of this.points) {
                let distance = Math.sqrt(
                    Math.pow(point.x - otherPoint.x, 2) + 
                    Math.pow(point.y - otherPoint.y, 2)
                );
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(point.x, point.y);
                    this.ctx.lineTo(otherPoint.x, otherPoint.y);
                    this.ctx.strokeStyle = `${this.colors[this.currentColorIndex]}${Math.floor((1 - distance/100) * 255).toString(16).padStart(2, '0')}`;
                    this.ctx.stroke();
                }
            }
        }
        requestAnimationFrame(() => this.animate());
    }
} 