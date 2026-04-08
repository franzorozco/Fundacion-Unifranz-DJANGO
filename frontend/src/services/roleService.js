// services/roleService.js
const API_ROLES = "http://127.0.0.1:8000/api/roles/";

export const getRoles = async (token) => {
  const res = await fetch(API_ROLES, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  console.log("ROLES RESPONSE:", data); // 🔥 DEBUG

  return data.results || data;
};

export const createRole = async (role, token) => {
  const res = await fetch(API_ROLES, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(role),
  });
  return res.json();
};

export const updateRole = async (id, role, token) => {
  const res = await fetch(`${API_ROLES}${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(role),
  });
  return res.json();
};

export const deleteRole = async (id, token) => {
  await fetch(`${API_ROLES}${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};