export const loginUser = async (username, password) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        error: "Usuario o contraseña incorrectos"
      };
    }
    return data;
  } catch (error) {
    return { error: "Error de conexión con el servidor" };
  }
};