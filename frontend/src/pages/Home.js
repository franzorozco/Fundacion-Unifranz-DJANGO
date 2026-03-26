import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, Rocket, Info, LayoutDashboard } from "lucide-react";
import "./home.css";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const images = [
  "https://images.unsplash.com/photo-1593113630400-ea4288922497",
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a",
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6"
];

function HeroImage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-image">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          alt="Voluntariado"

          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}

          transition={{ duration: 0.8, ease: "easeInOut" }}

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

      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/" className="logo">
          <img src="/logo_fundacion.png" alt="Fundación Solidaria" />
        </Link>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </div>

        <ul className={`menu ${menuOpen ? "active" : ""}`}>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#nosotros">Nosotros</a></li>
          <li><a href="#como-funciona">Cómo ayudar</a></li>
          <li><a href="#impacto">Impacto</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>

        <div className="auth-buttons">
          {isLogged ? (
            <Link to="/dashboard" className="dashboard-btn">
              <LayoutDashboard size={18} />
              Ir al panel
            </Link>
          ) : (
            <Link to="/login" className="login-btn">
              <LogIn size={18} />
              Iniciar sesión
            </Link>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="inicio">
        <div className="hero-text">
          <h1>Conectamos personas que quieren ayudar</h1>
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
              <Link to="/login" className="primary-btn">
                <Rocket size={18} />
                Empezar ahora
              </Link>
            )}

            <a href="#como-funciona" className="secondary-btn">
              <Info size={18} />
              Cómo funciona
            </a>
          </div>
        </div>

        <HeroImage />
      </section>

      {/* NOSOTROS */}
      <section className="about" id="nosotros">
        <h2>Sobre la Fundación</h2>
        <p>
          Nuestra misión es optimizar la redistribución de bienes y coordinar
          voluntarios para apoyar a comunidades vulnerables mediante tecnología.
        </p>

        <div className="about-cards">
          <div className="card">
            <h3>Donaciones</h3>
            <p>Conecta tus donaciones con quienes más las necesitan.</p>
          </div>
 
          <div className="card">
            <h3>Voluntariado</h3>
            <p>Participa en actividades solidarias cerca de tu ubicación.</p>
          </div>

          <div className="card">
            <h3>Impacto</h3>
            <p>Seguimiento real de la ayuda entregada.</p>
          </div>
        </div>
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

        <div className="stats">
          <div className="stat">
            <h3>+500</h3>
            <p>Donaciones realizadas</p>
          </div>

          <div className="stat">
            <h3>+200</h3>
            <p>Voluntarios activos</p>
          </div>

          <div className="stat">
            <h3>+50</h3>
            <p>Comunidades apoyadas</p>
          </div>
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