/* =========================================================
   INTERACTIVE GAMING CANVAS & ENGINE (SCRIPT.JS)
   ========================================================= */

class CanvasEngine {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 70;
    this.mouse = { x: null, y: null, radius: 150 };
    
    // FPS Monitor
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();

    this.init();
  }

  init() {
    // إعدادات الكانفاس لتغطية الشاشة بالكامل
    this.canvas.id = 'bg-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none';
    document.body.appendChild(this.canvas);

    this.resize();
    this.createParticles();
    this.addEventListeners();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // إضافة تأثير إنفجار جزيئات عند الضغط في أي مكان
    window.addEventListener('click', (e) => {
      for (let i = 0; i < 8; i++) {
        this.particles.push(new Particle(this, e.clientX, e.clientY, true));
        if (this.particles.length > this.particleCount + 20) {
          this.particles.shift();
        }
      }
    });
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new Particle(this));
    }
  }

  calculateFPS(now) {
    this.frameCount++;
    if (now - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = now;
    }
  }

  animate() {
    const now = performance.now();
    this.calculateFPS(now);

    this.ctx.clearRect(0, 0, this.width, this.height);

    // تحديث ورسم الجزيئات
    this.particles.forEach((p, index) => {
      p.update();
      p.draw();

      // ربط الجزيئات القريبة ببعضها بخطوط ضوئية
      for (let j = index + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(59, 130, 246, ${1 - dist / 120})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    });

    // رسم عداد الـ FPS بالزاوية العليا
    this.ctx.fillStyle = '#4ade80';
    this.ctx.font = '12px monospace';
    this.ctx.fillText(`FPS: ${this.fps}`, 15, 25);

    requestAnimationFrame(() => this.animate());
  }
}

class Particle {
  constructor(engine, x = null, y = null, isBurst = false) {
    this.engine = engine;
    this.x = x ?? Math.random() * engine.width;
    this.y = y ?? Math.random() * engine.height;
    this.radius = isBurst ? Math.random() * 3 + 2 : Math.random() * 2 + 1;

    const speedMultiplier = isBurst ? 4 : 1.5;
    this.vx = (Math.random() - 0.5) * speedMultiplier;
    this.vy = (Math.random() - 0.5) * speedMultiplier;

    this.color = isBurst ? '#38bdf8' : '#3b82f6';
  }

  update() {
    // الحركة
    this.x += this.vx;
    this.y += this.vy;

    // الإرتداد عن الحواف
    if (this.x < 0 || this.x > this.engine.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.engine.height) this.vy *= -1;

    // التفاعل مع الماوس (الابتعاد عند اقتراب المؤشر)
    if (this.engine.mouse.x !== null) {
      const dx = this.x - this.engine.mouse.x;
      const dy = this.y - this.engine.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.engine.mouse.radius) {
        const force = (this.engine.mouse.radius - dist) / this.engine.mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * force * 3;
        this.y += Math.sin(angle) * force * 3;
      }
    }
  }

  draw() {
    this.engine.ctx.beginPath();
    this.engine.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.engine.ctx.fillStyle = this.color;
    this.engine.ctx.shadowBlur = 8;
    this.engine.ctx.shadowColor = this.color;
    this.engine.ctx.fill();
    this.engine.ctx.shadowBlur = 0; // إعادة ضبط لإبقاء الأداء عالياً
  }
}

// تشغيل المحرك بعد اكتمال تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new CanvasEngine();
});
