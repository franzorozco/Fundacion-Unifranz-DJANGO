import { useEffect, useRef } from "react";

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particles = [];
    let explosions = [];
    const mouse = { x: null, y: null };

    let animationId;
    let lastTime = 0;
    const FPS = 60;
    const interval = 1000 / FPS;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 🔻 Menos partículas si la pantalla es chica
    const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 70;

    const handleMouseMove = (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };

    const handleClick = (e) => {
      explosions.push({
        x: e.x,
        y: e.y,
        radius: 0,
        alpha: 1,
      });

      // 🔻 menos partículas en explosión
      for (let i = 0; i < 10; i++) {
        particles.push({
          x: e.x,
          y: e.y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
        });
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    // partículas base
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
      });
    }

    function draw(time) {
      animationId = requestAnimationFrame(draw);

      if (time - lastTime < interval) return;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 🔥 explosiones
      for (let i = explosions.length - 1; i >= 0; i--) {
        const exp = explosions[i];
        exp.radius += 3;
        exp.alpha -= 0.03;

        ctx.beginPath();
        ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(59,170,216,${exp.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (exp.alpha <= 0) explosions.splice(i, 1);
      }

      // 🔗 conexiones limitadas
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // 🧲 interacción mouse (sin sqrt)
        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 120 * 120) {
            p.x -= dx * 0.02;
            p.y -= dy * 0.02;
          }
        }

        // 🔵 partícula simple (sin gradient)
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59,170,216,0.8)";
        ctx.fill();

        // 🔗 conexiones limitadas (solo siguientes partículas)
        for (let j = i + 1; j < i + 10 && j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 120 * 120) {
            const alpha = 1 - distSq / (120 * 120);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59,170,216,${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    />
  );
}