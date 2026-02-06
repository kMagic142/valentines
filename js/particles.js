'use strict';
class RosePetalSystem {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.petals = [];
        this.animationId = null;
        this.isRunning = false;

        this.config = {
            maxPetals: options.maxPetals || 40,
            spawnRate: options.spawnRate || 0.3,
            colors: options.colors || [
                '#C8507A',
                '#E8809A',
                '#FFB6C1',
                '#FF91A4',
                '#D4728C',
                '#F0A0B0',
                '#B04060',
            ],
            minSize: options.minSize || 8,
            maxSize: options.maxSize || 18,
            minSpeed: options.minSpeed || 0.3,
            maxSpeed: options.maxSpeed || 1.2,
            wind: options.wind || 0.3,
            opacity: options.opacity || { min: 0.3, max: 0.7 },
        };

        this._handleResize = this._handleResize.bind(this);
        this._animate = this._animate.bind(this);

        this._handleResize();
        window.addEventListener('resize', this._handleResize);
    }

    _handleResize() {
        const dpr = window.devicePixelRatio || 1;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    _createPetal(startFromTop = true) {
        const size = this._random(this.config.minSize, this.config.maxSize);
        const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];

        return {
            x: Math.random() * this.width,
            y: startFromTop ? -size * 2 : Math.random() * this.height,
            size,
            color,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.03,
            speedY: this._random(this.config.minSpeed, this.config.maxSpeed),
            speedX: (Math.random() - 0.5) * this.config.wind,
            wobblePhase: Math.random() * Math.PI * 2,
            wobbleSpeed: this._random(0.01, 0.03),
            wobbleAmplitude: this._random(0.3, 1.0),
            opacity: this._random(this.config.opacity.min, this.config.opacity.max),
            scaleX: this._random(0.6, 1.0),
            flipSpeed: this._random(0.005, 0.02),
            flipPhase: Math.random() * Math.PI * 2,
        };
    }

    _drawPetal(petal) {
        const { ctx } = this;
        const { x, y, size, color, rotation, opacity, scaleX, flipPhase } = petal;
        const currentScaleX = Math.sin(flipPhase) * scaleX;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(currentScaleX, 1);
        ctx.globalAlpha = opacity;

        ctx.beginPath();
        ctx.moveTo(0, -size * 0.5);
        ctx.bezierCurveTo(
            size * 0.5, -size * 0.3,
            size * 0.4, size * 0.3,
            0, size * 0.5
        );
        ctx.bezierCurveTo(
            -size * 0.4, size * 0.3,
            -size * 0.5, -size * 0.3,
            0, -size * 0.5
        );
        ctx.closePath();

        const grad = ctx.createRadialGradient(
            size * 0.1, -size * 0.1, 0,
            0, 0, size * 0.5
        );
        grad.addColorStop(0, this._lighten(color, 30));
        grad.addColorStop(1, color);

        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -size * 0.35);
        ctx.quadraticCurveTo(size * 0.05, 0, 0, size * 0.35);
        ctx.strokeStyle = this._lighten(color, -15);
        ctx.globalAlpha = opacity * 0.3;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
    }

    _updatePetal(petal) {
        petal.wobblePhase += petal.wobbleSpeed;
        petal.flipPhase += petal.flipSpeed;
        petal.rotation += petal.rotationSpeed;

        petal.x += petal.speedX + Math.sin(petal.wobblePhase) * petal.wobbleAmplitude;
        petal.y += petal.speedY;

        petal.speedX += (Math.random() - 0.5) * 0.01;
        petal.speedX = Math.max(-1, Math.min(1, petal.speedX));
    }

    _isOffScreen(petal) {
        return (
            petal.y > this.height + petal.size * 2 ||
            petal.x < -petal.size * 3 ||
            petal.x > this.width + petal.size * 3
        );
    }

    _animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        if (this.petals.length < this.config.maxPetals && Math.random() < this.config.spawnRate) {
            this.petals.push(this._createPetal(true));
        }
        for (let i = this.petals.length - 1; i >= 0; i--) {
            const petal = this.petals[i];
            this._updatePetal(petal);
            this._drawPetal(petal);

            if (this._isOffScreen(petal)) {
                this.petals.splice(i, 1);
            }
        }

        if (this.isRunning) {
            this.animationId = requestAnimationFrame(this._animate);
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        const seedCount = Math.floor(this.config.maxPetals * 0.5);
        for (let i = 0; i < seedCount; i++) {
            this.petals.push(this._createPetal(false));
        }

        this._animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    destroy() {
        this.stop();
        this.petals = [];
        window.removeEventListener('resize', this._handleResize);
    }

    _random(min, max) {
        return min + Math.random() * (max - min);
    }

    _lighten(hex, amount) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
        return `rgb(${r},${g},${b})`;
    }
}


class EmojiCelebration {
    static burst(options = {}) {
        const {
            x = window.innerWidth / 2,
            y = window.innerHeight / 2,
            count = 30,
            emojis = ['🎉', '🥳', '💕', '💖', '🌹', '✨', '💗', '🎊'],
            duration = 3000,
            spread = 360,
            container = document.body,
        } = options;

        const particles = [];

        for (let i = 0; i < count; i++) {
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            const el = document.createElement('div');
            el.className = 'emoji-particle';
            el.textContent = emoji;
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.style.fontSize = (1.2 + Math.random() * 1.5) + 'rem';

            const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180);
            const velocity = 3 + Math.random() * 6;
            const vx = Math.cos(angle - Math.PI / 2) * velocity;
            const vy = Math.sin(angle - Math.PI / 2) * velocity;

            container.appendChild(el);

            particles.push({
                el,
                x,
                y,
                vx,
                vy,
                gravity: 0.08 + Math.random() * 0.05,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 10,
                opacity: 1,
                fadeRate: 0.3 + Math.random() * 0.7,
                scale: 0.8 + Math.random() * 0.5,
                born: performance.now(),
            });
        }

        const animate = (now) => {
            let alive = false;

            for (const p of particles) {
                const age = now - p.born;
                const lifeProgress = age / duration;

                if (lifeProgress >= 1) {
                    if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
                    continue;
                }

                alive = true;

                p.vy += p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                p.vx *= 0.99;

                const fadeStart = 0.6;
                const opacity = lifeProgress > fadeStart
                    ? 1 - ((lifeProgress - fadeStart) / (1 - fadeStart))
                    : 1;

                p.el.style.transform = `translate(${p.x - x}px, ${p.y - y}px) rotate(${p.rotation}deg) scale(${p.scale})`;
                p.el.style.opacity = opacity;
            }

            if (alive) {
                requestAnimationFrame(animate);
            } else {
                particles.forEach(p => {
                    if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
                });
            }
        };

        requestAnimationFrame(animate);
    }

    static continuous(options = {}) {
        const {
            interval = 600,
            burstCount = 8,
        } = options;

        let running = true;

        const spawnBurst = () => {
            if (!running) return;

            EmojiCelebration.burst({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight * 0.5,
                count: burstCount,
                ...options,
            });

            setTimeout(spawnBurst, interval + Math.random() * 400);
        };

        spawnBurst();

        return () => { running = false; };
    }
}

window.RosePetalSystem = RosePetalSystem;
window.EmojiCelebration = EmojiCelebration;
