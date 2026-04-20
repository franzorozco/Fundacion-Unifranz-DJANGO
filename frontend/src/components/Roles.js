import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./Users.css"; // Reutilizamos los estilos de Users para consistencia
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../services/roleService";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingRole, setEditingRole] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState({ name: "" });
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("id_asc");
  const [groupByInitial, setGroupByInitial] = useState(false);

  const token = localStorage.getItem("token");

const loadRoles = async () => {
  const data = await getRoles(token);
  setRoles(Array.isArray(data) ? data : data.results || []);
};

  useEffect(() => {
    loadRoles();
  }, []);

  /* ---------------- VALIDACIONES EN TIEMPO REAL ---------------- */
  const validateField = (name, value) => {
    let error = "";
    if (name === "name") {
      if (!value.trim()) error = "Nombre del rol obligatorio";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    validateField(field, value);
  };

  /* ---------------- FILTROS  ---------------- */
  const getProcessedRoles = () => {
    let filtered = Array.isArray(roles) ? [...roles] : [];

    // 🔍 BUSCADOR
    if (search) {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 🔢 ORDENAMIENTO
    if (orderBy === "id_asc") {
      filtered.sort((a, b) => a.id - b.id);
    } else if (orderBy === "id_desc") {
      filtered.sort((a, b) => b.id - a.id);
    } else if (orderBy === "name_asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (orderBy === "name_desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  };


  const groupedRoles = () => {
    const data = getProcessedRoles();

    if (!groupByInitial) return { Todos: data };

    const groups = {};

    data.forEach((r) => {
      const letter = r.name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(r);
    });

    return groups;
  };

  /* ---------------- CREATE / UPDATE ---------------- */
  const handleSubmit = async () => {
    const validName = validateField("name", form.name);
    if (!validName) {
      alert("Corrige los errores del formulario");
      return;
    }

    let response;
    if (editingRole) {
      response = await updateRole(editingRole.id, form, token);
    } else {
      response = await createRole(form, token);
    }

    if (response.error || response.detail) {
      console.error(response);
      alert("Error al guardar rol");
      return;
    }

    closeModal();
    loadRoles();
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar rol?")) return;
    await deleteRole(id, token);
    loadRoles();
  };

  /* ---------------- MODAL CONTROL ---------------- */
  const openCreate = () => {
    setEditingRole(null);
    setForm({ name: "" });
    setErrors({ name: "" });
    setModalOpen(true);
  };

  const openEdit = (role) => {
    setEditingRole(role);
    setForm({ name: role.name });
    setErrors({ name: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRole(null);
    setForm({ name: "" });
    setErrors({ name: "" });
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="users-container">
        {/* HEADER */}
        <div className="users-header">
          <div>
            <h1>Roles</h1>
            <p className="subtitle">Administración de roles</p>
          </div>
          <button className="primary-btn" onClick={openCreate}>
            + Nuevo rol
          </button>
        </div>


        <div className="filters">
          <input
            placeholder="Buscar rol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setOrderBy(e.target.value)}>
            <option value="id_asc">ID ↑</option>
            <option value="id_desc">ID ↓</option>
            <option value="name_asc">Nombre A-Z</option>
            <option value="name_desc">Nombre Z-A</option>
          </select>

          <label>
            <input
              type="checkbox"
              checked={groupByInitial}
              onChange={() => setGroupByInitial(!groupByInitial)}
            />
            Agrupar por inicial
          </label>

          {/* 📊 contador */}
          <span style={{ marginLeft: "auto", fontSize: "13px", opacity: 0.7 }}>
            {getProcessedRoles().length} resultados
          </span>
        </div>

        {/* TABLA */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedRoles()).map(([group, rolesList]) => (
                <>
                  {groupByInitial && (
                    <tr className="group-header">
                      <td colSpan="3">{group}</td>
                    </tr>
                  )}

                  {Array.isArray(rolesList) &&
                  rolesList.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.name}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="small-btn edit-small"
                            onClick={() => openEdit(r)}
                          >
                            Editar
                          </button>

                          <button
                            className="small-btn delete-small"
                            onClick={() => handleDelete(r.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY */}
        {Array.isArray(roles) && roles.length === 0 && (
          <div className="empty-state">
            <h3>No hay roles</h3>
            <p>Crea el primero</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingRole ? "Editar rol" : "Crear rol"}</h3>
            <input
              placeholder="Nombre del rol"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && <p className="form-error">{errors.name}</p>}

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>
                Cancelar
              </button>
              <button className="primary-btn" onClick={handleSubmit}>
                {editingRole ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roles;