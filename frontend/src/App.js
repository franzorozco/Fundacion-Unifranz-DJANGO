import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Leer el token desde localStorage
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    // Escuchar cambios en el almacenamiento
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return <AppRoutes token={token} />;
}

export default App;