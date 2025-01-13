class Confetti {
    constructor() {
        this.particles = [];
        // Vegas-themed colors
        this.colors = ['#ff00ff', '#ffff00', '#00ffff', '#ff0000', '#ffffff'];
        this.isActive = false;
    }

    createParticle(x, y) {
        return {
            x,
            y,
            size: Math.random() * 3 + 2,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            speedX: Math.random() * 6 - 3,
            speedY: Math.random() * -3 - 3,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
            opacity: 1
        };
    }

    burst(x, y) {
        if (!this.isActive) {
            this.isActive = true;
            // Create 50 particles
            for (let i = 0; i < 50; i++) {
                this.particles.push(this.createParticle(x, y));
            }
            this.animate();
        }
    }

    animate() {
        const canvas = document.getElementById('confettiCanvas');
        const ctx = canvas.getContext('2d');

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = this.particles.length - 1; i >= 0; i--) {
                const particle = this.particles[i];
                
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.speedY += 0.1; // gravity
                particle.rotation += particle.rotationSpeed;
                particle.opacity -= 0.005;

                ctx.save();
                ctx.translate(particle.x, particle.y);
                ctx.rotate((particle.rotation * Math.PI) / 180);
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particle.color;
                ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                ctx.restore();

                if (particle.opacity <= 0) {
                    this.particles.splice(i, 1);
                }
            }

            if (this.particles.length > 0) {
                requestAnimationFrame(animate);
            } else {
                this.isActive = false;
            }
        };

        requestAnimationFrame(animate);
    }
}

const confetti = new Confetti(); 