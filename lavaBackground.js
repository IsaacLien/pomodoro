class LavaBackground {
    constructor() {
        this.canvas = document.getElementById('lavaCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.orbs = [];
        this.colors = ['#0ff', '#f0f', '#00f', '#f00'];
        this.init();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Create more orbs for a busier background
        for (let i = 0; i < 8; i++) {
            this.orbs.push(this.createOrb());
        }

        this.animate();
    }

    createOrb() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            radius: Math.random() * 200 + 100,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            speedX: Math.random() * 0.4 - 0.2,
            speedY: Math.random() * 0.4 - 0.2,
            phase: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.5 + 0.2
        };
    }

    drawOrb(orb) {
        this.ctx.beginPath();
        const gradient = this.ctx.createRadialGradient(
            orb.x, orb.y, 0,
            orb.x, orb.y, orb.radius
        );
        gradient.addColorStop(0, orb.color + Math.floor(orb.opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = gradient;
        this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Add cyberpunk grid effect
        this.ctx.strokeStyle = orb.color + '22';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for(let i = 0; i < orb.radius * 2; i += 20) {
            this.ctx.moveTo(orb.x - orb.radius + i, orb.y - orb.radius);
            this.ctx.lineTo(orb.x - orb.radius + i, orb.y + orb.radius);
        }
        for(let i = 0; i < orb.radius * 2; i += 20) {
            this.ctx.moveTo(orb.x - orb.radius, orb.y - orb.radius + i);
            this.ctx.lineTo(orb.x + orb.radius, orb.y - orb.radius + i);
        }
        this.ctx.stroke();
    }

    animate() {
        // Create dark overlay with grid effect
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid background
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        const gridSize = 50;
        for(let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for(let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        // Update and draw orbs
        this.orbs.forEach(orb => {
            orb.phase += 0.002;
            orb.x += orb.speedX + Math.sin(orb.phase) * 0.5;
            orb.y += orb.speedY + Math.cos(orb.phase) * 0.5;
            orb.opacity = 0.3 + Math.sin(orb.phase) * 0.2;

            if (orb.x < -orb.radius) orb.x = this.canvas.width + orb.radius;
            if (orb.x > this.canvas.width + orb.radius) orb.x = -orb.radius;
            if (orb.y < -orb.radius) orb.y = this.canvas.height + orb.radius;
            if (orb.y > this.canvas.height + orb.radius) orb.y = -orb.radius;

            this.drawOrb(orb);
        });

        requestAnimationFrame(() => this.animate());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
} 