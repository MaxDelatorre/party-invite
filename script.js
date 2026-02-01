const texts = {
    birthday: "Birthday",
    party: "PARTY",
    toast: "LET'S TOAST TO FABULOUS",
    name: "Ana's",
    age: "50th",
    date: "SATURDAY",
    time: "MARCH 21    AT 6 PM",
    year: "2026",
    address: "ADDRESS TBA"
};

const elements = {
    birthday: document.getElementById("birthday-text"),
    party: document.getElementById("party-text"),
    toast: document.getElementById("toast-text"),
    name: document.getElementById("name-text"),
    age: document.getElementById("age-text"),
    date: document.getElementById("date-text"),
    time: document.getElementById("time-text"),
    year: document.getElementById("year-text"),
    address: document.getElementById("address-text")
};

let currentIndex = 0;
let currentElement = null;
let currentText = "";

function typeWriter(elementKey, text, callback) {
    currentElement = elements[elementKey];
    currentText = text;
    currentIndex = 0;
    
    function type() {
        if (currentIndex < currentText.length) {
            currentElement.textContent += currentText.charAt(currentIndex);
            currentIndex++;
            setTimeout(type, 60);
        } else if (callback) {
            setTimeout(callback, 200);
        }
    }
    
    type();
}

window.addEventListener('load', () => {
    setTimeout(() => {
        typeWriter('birthday', texts.birthday, () => {
            typeWriter('party', texts.party, () => {
                typeWriter('toast', texts.toast, () => {
                    typeWriter('name', texts.name, () => {
                        typeWriter('age', texts.age, () => {
                            typeWriter('date', texts.date, () => {
                                typeWriter('time', texts.time, () => {
                                    typeWriter('year', texts.year, () => {
                                        typeWriter('address', texts.address);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }, 800);
});

document.querySelector('.scroll-arrow').addEventListener('click', () => {
    document.querySelector('.details-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

document.querySelector('.scroll-up').addEventListener('click', () => {
    document.querySelector('.hero-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor(x, y, color, angle, speed) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
        this.speed = speed;
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
        this.alpha = 1;
        this.decay = 0.01;
        this.gravity = 0.06;
        this.friction = 0.98;
        this.size = Math.random() * 3 + 2;
        this.trail = [];
    }

    draw() {
        ctx.save();
        
        for (let i = 0; i < this.trail.length; i++) {
            const trailAlpha = this.alpha * (i / this.trail.length) * 0.5;
            ctx.globalAlpha = trailAlpha;
            
            const gradient = ctx.createRadialGradient(
                this.trail[i].x, this.trail[i].y, 0, 
                this.trail[i].x, this.trail[i].y, this.size
            );
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(0.2, this.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, this.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = this.alpha;
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.2, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 5) {
            this.trail.shift();
        }
        
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
        
        if (this.alpha < 0) this.alpha = 0;
    }
}

class RocketTrail {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alpha = 1;
        this.size = Math.random() * 2 + 2;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.3, '#FFFACD');
        gradient.addColorStop(1, 'rgba(255, 250, 205, 0)');
        
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FFFACD';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.alpha -= 0.03;
    }
}

class Rocket {
    constructor(x, startY, targetY, color) {
        this.x = x;
        this.y = startY;
        this.targetY = targetY;
        this.color = color;
        this.speed = 6;
        this.trail = [];
        this.exploded = false;
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            
            this.trail.push(new RocketTrail(this.x, this.y));
            
            if (this.y <= this.targetY) {
                this.exploded = true;
                createFirework(this.x, this.y);
            }
        }
        
        for (let i = this.trail.length - 1; i >= 0; i--) {
            this.trail[i].update();
            if (this.trail[i].alpha <= 0) {
                this.trail.splice(i, 1);
            }
        }
    }

    draw() {
        this.trail.forEach(t => t.draw());
    }

    isDone() {
        return this.exploded && this.trail.length === 0;
    }
}

let particles = [];
let rockets = [];
let fireworkInterval = null;
let isOnHeroSection = true;
let canLaunch = true;

const colors = [
    '#FFD700',
    '#FFA500', 
    '#FF4444',
    '#00CED1',
    '#7FFF00',
    '#FF69B4',
    '#9370DB',
    '#FFB6C1'
];

function createFirework(x, y) {
    const particleCount = 80;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = Math.random() * 4 + 3;
        particles.push(new Particle(x, y, color, angle, speed));
    }
}

function launchFirework() {
    const x = Math.random() * canvas.width * 0.9 + canvas.width * 0.05;
    const startY = canvas.height;
    const targetY = Math.random() * (canvas.height * 0.35) + canvas.height * 0.15;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    rockets.push(new Rocket(x, startY, targetY, color));
}

function launchMultipleFireworks() {
    if (!canLaunch) return;
    
    canLaunch = false;
    
    launchFirework();
    setTimeout(() => {
        launchFirework();
    }, 600);
    
    setTimeout(() => {
        canLaunch = true;
    }, 4000);
}

let lastRefresh = Date.now();
const REFRESH_INTERVAL = 15000;

function animate() {
    const now = Date.now();
    if (now - lastRefresh > REFRESH_INTERVAL) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lastRefresh = now;
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    for (let i = rockets.length - 1; i >= 0; i--) {
        rockets[i].update();
        rockets[i].draw();
        if (rockets[i].isDone()) {
            rockets.splice(i, 1);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        } else {
            particles[i].update();
            particles[i].draw();
        }
    }

    requestAnimationFrame(animate);
}

animate();

function startFireworks() {
    if (fireworkInterval) return;
    
    canLaunch = true;
    launchMultipleFireworks();
    
    fireworkInterval = setInterval(() => {
        launchMultipleFireworks();
    }, 6000);
}

function stopFireworks() {
    if (fireworkInterval) {
        clearInterval(fireworkInterval);
        fireworkInterval = null;
    }
    canLaunch = true;
}

setTimeout(() => {
    startFireworks();
}, 6000);

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.target.classList.contains('hero-section')) {
            if (entry.isIntersecting) {
                isOnHeroSection = true;
                if (fireworkInterval) {
                    return;
                }
                startFireworks();
            } else {
                isOnHeroSection = false;
                stopFireworks();
            }
        }
    });
}, { threshold: 0.5 });

observer.observe(document.querySelector('.hero-section'));