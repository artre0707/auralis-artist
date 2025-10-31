import React, { useEffect, useRef } from 'react';

const Starfield: React.FC = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    let raf = 0;

    // ====== CONFIG ======
    const dprMax = 2;
    const baseDensityDiv = 12000;         // base density factor
    const starCap = 240;                   // maximum stars
    const milkyWayOpacity = 0.18;          // strength of milky way band
    const milkyWayAngle = -20 * Math.PI/180; // radians, negative = tilt left
    const milkyWayWidth = 0.65;            // portion of screen height covered (0~1)
    const shootingMinDelay = 18_000;       // min ms between shooting stars
    const shootingMaxDelay = 45_000;       // max ms between shooting stars
    const shootingDuration = 800;          // each meteor visible duration (ms)
    const shootingSpeed = 1.2;             // multiplier for travel speed

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ====== STATE ======
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, dprMax));
    let width = 0, height = 0;
    let stars: Star[] = [];
    let nextMeteorAt = 0;
    let meteor: Meteor | null = null;

    type Star = { x:number; y:number; r:number; tw:number; ph:number; sp:number; };
    type Meteor = { x:number; y:number; vx:number; vy:number; start:number; };

    function rand(min:number, max:number) { return Math.random() * (max - min) + min; }
    function randInt(min:number, max:number) { return Math.floor(rand(min, max)); }

    function scheduleMeteor(now:number) {
      nextMeteorAt = now + randInt(shootingMinDelay, shootingMaxDelay);
    }

    function spawnMeteor(now:number) {
      const fromTop = Math.random() < 0.5; // spawn from left-top or right-top
      const margin = 60;
      const startX = fromTop ? -margin : width + margin;
      const startY = rand(-margin, height * 0.5);
      // travel diagonally across
      const angle = fromTop ? rand(20, 40) * Math.PI/180 : rand(140, 160) * Math.PI/180;
      const speed = rand(8, 12) * shootingSpeed;
      meteor = {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        start: now
      };
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // density scales with area but capped
      const base = Math.min(starCap, Math.floor((width * height) / baseDensityDiv));
      stars = new Array(base).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        tw: Math.random() * 0.8 + 0.2,
        ph: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.15 + 0.02
      }));
    }

    function drawMilkyWay() {
      // draw a faint angled band across the sky
      ctx.save();
      ctx.translate(width/2, height/2);
      ctx.rotate(milkyWayAngle);
      const bandH = height * milkyWayWidth;
      const grd = ctx.createLinearGradient(0, -bandH/2, 0, bandH/2);
      // subtle warm to cool transparency for depth
      grd.addColorStop(0, `rgba(200, 180, 150, 0)`);
      grd.addColorStop(0.5, `rgba(240, 225, 200, ${milkyWayOpacity})`);
      grd.addColorStop(1, `rgba(200, 180, 150, 0)`);
      ctx.fillStyle = grd;
      ctx.fillRect(-width, -bandH/2, width * 2, bandH);
      ctx.restore();
    }

    function drawBackground() {
      // extremely subtle vignette so stars pop a bit in dark
      const grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, 'rgba(0,0,0,0.10)');
      grd.addColorStop(1, 'rgba(0,0,0,0.06)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);
    }

    function drawStars(t:number) {
      for (const s of stars) {
        const tw = prefersReduced ? 1 : (0.6 + 0.4 * Math.sin(s.ph + t * 0.001 * s.tw));
        ctx.globalAlpha = 0.7 * tw;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 245, 220, 0.95)'; // warm ivory
        ctx.fill();

        if (!prefersReduced) {
          s.y += s.sp;
          if (s.y > height + 2) s.y = -2;
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawMeteor(now:number) {
      if (!meteor) return;
      const elapsed = now - meteor.start;
      const life = Math.min(1, elapsed / shootingDuration);
      // fade in then out
      const alpha = life < 0.5 ? life * 2 : (1 - (life - 0.5) * 2);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.max(0, alpha) * 0.9;

      // head
      ctx.beginPath();
      ctx.arc(meteor.x, meteor.y, 2.2, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255, 250, 230, 1)';
      ctx.fill();

      // trail
      const trailLen = 80;
      const tx = -meteor.vx, ty = -meteor.vy;
      const mag = Math.hypot(tx, ty) || 1;
      const ux = (tx / mag) * trailLen;
      const uy = (ty / mag) * trailLen;

      const grad = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x + ux, meteor.y + uy);
      grad.addColorStop(0, 'rgba(255, 245, 220, 0.85)');
      grad.addColorStop(1, 'rgba(255, 245, 220, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(meteor.x, meteor.y);
      ctx.lineTo(meteor.x + ux, meteor.y + uy);
      ctx.stroke();

      ctx.restore();

      // update position
      meteor.x += meteor.vx;
      meteor.y += meteor.vy;

      // end conditions
      if (elapsed >= shootingDuration || meteor.x < -100 || meteor.x > width + 100 || meteor.y > height + 100) {
        meteor = null;
      }
    }

    function draw(t:number) {
      // clear or draw only when enabled
      if (document.body.dataset.stars !== 'on') {
        ctx.clearRect(0, 0, width, height);
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // background + milky way + stars
      drawBackground();
      drawMilkyWay();
      drawStars(t);

      // shooting star spawning
      const now = performance.now();
      if (!prefersReduced) {
        if (!meteor && now >= nextMeteorAt) {
          spawnMeteor(now);
        }
        drawMeteor(now);
        if (!meteor && now >= nextMeteorAt) {
          // reschedule next only after current meteor finishes
          scheduleMeteor(now);
        }
      }

      raf = requestAnimationFrame(draw);
    }

    // INITIALIZE
    function init(now:number) {
      resize();
      scheduleMeteor(now);
      raf = requestAnimationFrame(draw);
    }

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    // Sync opacity with dataset on mount and on custom event
    function syncOpacity() {
      canvas.style.opacity = (document.body.dataset.stars === 'on') ? '1' : '0';
    }
    syncOpacity();
    const onStarsChange = () => syncOpacity();
    window.addEventListener('stars:change', onStarsChange as EventListener);

    // kick
    requestAnimationFrame((t)=>init(t));

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('stars:change', onStarsChange as EventListener);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="auralis-stars"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity .6s ease',
        zIndex: 0
      }}
    />
  );
};

export default Starfield;