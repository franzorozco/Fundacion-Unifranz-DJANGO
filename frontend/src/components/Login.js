import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./Login.css";
import { ArrowLeft } from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const [isRegister, setIsRegister] = useState(false);

  const navigate = useNavigate();

  const handleSocialLogin = (provider) => {
    window.location.href = `http://127.0.0.1:8000/accounts/${provider}/login/?process=login`;
  };

  const validate = (name, value) => {
    let newErrors = { ...errors };

    if (name === "username") {
      if (!value.trim()) {
        newErrors.username = "El usuario es obligatorio";
      } else {
        delete newErrors.username;
      }
    }

    if (name === "password") {
      if (value.length < 4) {
        newErrors.password = "Mínimo 4 caracteres";
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const goHome = () => {
    navigate("/");
  };

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setServerError("");
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
    validate("username", e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    validate("password", e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setServerError("");

    if (!username || !password) {
      setServerError("Completa todos los campos");
      return;
    }

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    const data = await loginUser(username, password);

    setLoading(false);

    if (data.access) {
      localStorage.setItem("token", data.access);
      window.dispatchEvent(new Event("storage"));
      navigate("/dashboard");
    } else {
      setServerError(data.error || "Credenciales incorrectas");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!regUsername || !regEmail || !regPassword) {
      setServerError("Completa todos los campos");
      return;
    }

    if (regPassword.length < 4) {
      setServerError("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    console.log("Registro:", {
      username: regUsername,
      email: regEmail,
      password: regPassword,
    });

    alert("Usuario registrado (simulado)");

    setIsRegister(false);
  };

  return (
    <div className={`login-wrapper ${isRegister ? "active" : ""}`}>
      
      {/* PANEL IZQUIERDO */}
      <div className="login-left">
        <div className="overlay">
          <h1>{isRegister ? "ÚNETE" : "BIENVENIDO"}</h1>

          <p>
            {isRegister
              ? "Crea una cuenta para comenzar"
              : "Accede a tu sistema de gestión"}
          </p>

          <button className="switch-btn" onClick={toggleForm}>
            {isRegister ? "Iniciar sesión" : "Registrarse"}
          </button>
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div className="login-right">
        <button className="back-home" onClick={goHome}>
          <ArrowLeft size={18} />
          Volver al inicio
        </button>

        <div className="form-container">

          <form
            className={`form login-form ${isRegister ? "hidden" : ""}`}
            onSubmit={handleLogin}>
            <h2>Iniciar sesión</h2>

            <p className="login-subtitle">
              Ingresa a tu cuenta para continuar
            </p>

            <div className="social-login">
              <button
                type="button"
                className="social-btn google"
                onClick={() => handleSocialLogin("google")}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="" />
                Google
              </button>

              <button
                type="button"
                className="social-btn apple"
                onClick={() => handleSocialLogin("apple")}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="" />
                Apple
              </button>

              <button
                type="button"
                className="social-btn facebook"
                onClick={() => handleSocialLogin("facebook")}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="" />
                Facebook
              </button>
            </div>

            <div className="divider">
              <span>o</span>
            </div>
 
            {serverError && <p className="error">{serverError}</p>}

            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={handleUsername}/>

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={handlePassword}/>

            <button type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Entrar"}
            </button>
          </form>

          <form
            className={`form register-form ${isRegister ? "show" : ""}`}
            onSubmit={handleRegister}>
            <h2>Registrarse</h2>

            {serverError && <p className="error">{serverError}</p>}

            <input
              type="text"
              placeholder="Usuario"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}/>

            <input
              type="email"
              placeholder="Correo"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}/>

            <input
              type="password"
              placeholder="Contraseña"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}/>

            <button type="submit">Crear cuenta</button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;