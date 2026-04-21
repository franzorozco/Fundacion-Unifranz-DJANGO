import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, LayoutDashboard, Menu, X } from "lucide-react";
import { User } from "lucide-react";
import "./navbar.css";

function Navbar() {
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
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src="/logo_fundacion.png" alt="Fundación Solidaria" />
      </Link>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X /> : <Menu />}
      </div>

      <ul className={`menu ${menuOpen ? "active" : ""}`}>
        <li><a href="/">Inicio</a></li>
        <li><a href="/explore-campaigns">Campañas</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>

      <div className="auth-buttons">
        {isLogged ? (
          <>
            <Link to="/profile" className="profile-btn">
              <User size={18} />
              Mi perfil
            </Link>

            <Link to="/dashboard" className="dashboard-btn">
              <LayoutDashboard size={18} />
              Panel
            </Link>
          </>
        ) : (
          <Link to="/login" className="login-btn">
            <LogIn size={18} />
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;