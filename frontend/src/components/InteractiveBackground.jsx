import { useEffect, useRef } from "react";

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particles = [];
    let explosions = []; // 🔥 clicks
    const mouse = { x: null, y: null };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    // 💥 CLICK → EXPLOSIÓN
    window.addEventListener("click", (e) => {
      explosions.push({
        x: e.x,
        y: e.y,
        radius: 0,
        alpha: 1,
      });

      // partículas disparadas
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: e.x,
          y: e.y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
        });
      }
    });

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // partículas base
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 🔥 EXPLOSIONES (ondas)
      explosions.forEach((exp, i) => {
        exp.radius += 4;
        exp.alpha -= 0.02;

        ctx.beginPath();
        ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(59,170,216,${exp.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (exp.alpha <= 0) {
          explosions.splice(i, 1);
        }
      });

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // rebote suave
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // 🧲 interacción mouse
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          p.x -= dx * 0.03;
          p.y -= dy * 0.03;
        }

        // ✨ glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10);
        gradient.addColorStop(0, "rgba(59,170,216,0.9)");
        gradient.addColorStop(1, "rgba(59,170,216,0)");

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // 🔗 líneas
        particles.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59,170,216,${1 - dist / 120})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(draw);
    }

    draw();
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