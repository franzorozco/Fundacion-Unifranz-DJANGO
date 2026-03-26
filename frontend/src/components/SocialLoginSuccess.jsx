import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SocialLoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/auth/user/", {
      method: "GET",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("No autenticado");
        return fetch("http://127.0.0.1:8000/social-login-success/", {
          credentials: "include",
        });
      })
      .then(res => res.json())
      .then(data => {
        if (data.access) {
          localStorage.setItem("token", data.access);

          window.dispatchEvent(new Event("storage"));

          navigate("/dashboard");
        } else {
          throw new Error("Token no recibido");
        }
      })
      .catch(err => {
        console.error("Error durante el inicio de sesión:", err.message);
        alert("Error durante el inicio de sesión: " + err.message);
        navigate("/login");
      });
  }, []);

  return <p>Iniciando sesión...</p>;
}

export default SocialLoginSuccess;