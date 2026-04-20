export const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
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


const API = "http://127.0.0.1:8000/api/users/";

export const getUsers = async (token) => {
  const res = await fetch(API, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  console.log("USERS RESPONSE:", data); // 🔥 DEBUG

  return data.results || data;
};

export const createUser = async (user, token) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data };
  }

  return data;
};

export const updateUser = async (id, user, token) => {
  const res = await fetch(`http://127.0.0.1:8000/api/users/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });

  return res.json();
};

export const deleteUser = async (id, token) => {
  await fetch(`${API}${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


