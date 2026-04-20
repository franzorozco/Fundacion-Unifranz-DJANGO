import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, Rocket, Info, LayoutDashboard } from "lucide-react";
import "./home.css";
import { Menu, X } from "lucide-react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveBackground from "../components/InteractiveBackground";



const images = [
  "https://images.unsplash.com/photo-1593113630400-ea4288922497",
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a",
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6"
];
const text = "Conectamos personas que quieren ayudar";



const Counter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;

    const interval = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) {
        start = end;
        clearInterval(interval);
      }
      setCount(start);
    }, 30);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <motion.h3
      initial={{ scale: 0.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
    >
      +{count}
    </motion.h3>
  );
};


const MagneticButton = ({ children, className }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      className={className}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setPos({ x: x * 0.3, y: y * 0.3 }); // más fuerte
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
animate={{
  x: pos.x,
  y: pos.y
}}
transition={{ type: "spring", stiffness: 50 }}
    >
      {children}
    </motion.div>
  );
};


function HeroImage() {
  const [index, setIndex] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

const handleMouseMove = (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 60;
  const y = (e.clientY / window.innerHeight - 0.5) * 60;
  setPos({ x, y });
};

  return (
    <div className="hero-image" onMouseMove={handleMouseMove}>
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          alt="Voluntariado"
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px)`
          }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="hero-img"
        />
      </AnimatePresence>
    </div>
  );
}

function Home() {
  const [isLogged, setIsLogged] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLogged(!!token);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <div className="home">
      <InteractiveBackground />
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <motion.section
        className="hero"
        id="inicio"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-text">
          <h1>
  {text.split("").map((char, i) => (
<motion.span
  key={i}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: i * 0.02 }}
>
      {char}
    </motion.span>
  ))}
</h1>
          <p>
            Plataforma para donaciones y voluntariado que apoya a comunidades
            vulnerables. Dona, participa y genera impacto real.
          </p>

          <div className="hero-buttons">
            {isLogged ? (
              <Link to="/dashboard" className="primary-btn">
                <LayoutDashboard size={18} />
                Ir a mi panel
              </Link>
            ) : (
<MagneticButton>
  <Link to="/login" className="primary-btn">
    <Rocket size={18} />
    Empezar ahora
  </Link>
</MagneticButton>
            )}
<MagneticButton>
  <a href="#como-funciona" className="secondary-btn">
    <Info size={18} />
    Cómo funciona
  </a>
</MagneticButton>

          </div>
        </div>

        <HeroImage />
      </motion.section>

      {/* NOSOTROS */}
      <section className="about" id="nosotros">
        <h2>Sobre la Fundación</h2>
        <p>
          Nuestra misión es optimizar la redistribución de bienes y coordinar
          voluntarios para apoyar a comunidades vulnerables mediante tecnología.
        </p>

<motion.div
  className="about-cards"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }} // 🔥 clave
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.25
      }
    }
  }}
>
{[
  { title: "Donaciones", link: "#" },
  { title: "Voluntarios", link: "/volunteers" },
  { title: "Impacto", link: "#" }
].map((item, i) => (
  <motion.div
    key={i}
    className="card"
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 }
    }}
  >
    <Link to={item.link} style={{ textDecoration: "none", color: "inherit" }}>
      <h3>{item.title}</h3>
    </Link>
  </motion.div>
))}
</motion.div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="how" id="como-funciona">
        <h2>Cómo funciona</h2>

        <div className="steps">
          <div className="step">
            <span>1</span>
            <h3>Regístrate</h3>
            <p>Crea tu cuenta en la plataforma.</p>
          </div>

          <div className="step">
            <span>2</span>
            <h3>Publica o ayuda</h3>
            <p>Realiza donaciones o participa como voluntario.</p>
          </div>

          <div className="step">
            <span>3</span>
            <h3>Genera impacto</h3>
            <p>Ayuda a comunidades vulnerables.</p>
          </div>
        </div>
      </section>

      {/* IMPACTO */}
      <section className="impact" id="impacto">
        <h2>Nuestro impacto</h2>

        <div className="stat">
  <Counter value={500} />
  <p>Donaciones realizadas</p>
</div>

<div className="stat">
  <Counter value={200} />
  <p>Voluntarios activos</p>
</div>

<div className="stat">
  <Counter value={50} />
  <p>Comunidades apoyadas</p>
</div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Únete a nuestra comunidad</h2>
        <p>Empieza a ayudar hoy mismo.</p>

        {isLogged ? (
          <Link to="/dashboard" className="primary-btn">
            Ir al panel
          </Link>
        ) : (
          <Link to="/login" className="primary-btn">
            Crear cuenta
          </Link>
        )}
      </section>

      {/* FOOTER */}
      <footer className="footer" id="contacto">
        <div>
          <h3>Fundación Solidaria</h3>
          <p>Ayudando a comunidades vulnerables con tecnología.</p>
        </div>

        <div>
          <h4>Enlaces</h4>
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
            <li><a href="#impacto">Impacto</a></li>
          </ul>
        </div>

        <div>
          <h4>Contacto</h4>
          <p>contacto@fundacion.org</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;