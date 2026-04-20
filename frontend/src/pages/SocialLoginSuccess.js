import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SocialLoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

  return <p>Iniciando sesión...</p>;
}

export default SocialLoginSuccess;