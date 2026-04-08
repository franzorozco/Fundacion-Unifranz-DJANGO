import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./Users.css";

import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../services/skillService";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingSkill, setEditingSkill] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState({ name: "" });
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("id_asc");
  const [groupByInitial, setGroupByInitial] = useState(false);

  const token = localStorage.getItem("token");

  const loadSkills = async () => {
    const data = await getSkills(token);
    setSkills(data.results || data);
    };

  useEffect(() => {
    loadSkills();
  }, []);

  /* VALIDACIÓN */
  const validateField = (name, value) => {
    let error = "";
    if (name === "name") {
      if (!value.trim()) error = "Nombre obligatorio";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    validateField(field, value);
  };

  /* FILTROS */
  const getProcessedSkills = () => {
    let filtered = [...skills];

    if (search) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      );
    }

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

  const groupedSkills = () => {
    const data = getProcessedSkills();

    if (!groupByInitial) return { Todos: data };

    const groups = {};
    data.forEach((s) => {
      const letter = s.name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(s);
    });

    return groups;
  };

  /* CREATE / UPDATE */
  const handleSubmit = async () => {
    const valid = validateField("name", form.name);
    if (!valid) return alert("Corrige errores");

    let response;

    if (editingSkill) {
      response = await updateSkill(editingSkill.id, form, token);
    } else {
      response = await createSkill(form, token);
    }

    if (response.error || response.detail) {
      alert("Error al guardar");
      return;
    }

    closeModal();
    loadSkills();
  };

  /* DELETE */
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar habilidad?")) return;
    await deleteSkill(id, token);
    loadSkills();
  };

  /* MODAL */
  const openCreate = () => {
    setEditingSkill(null);
    setForm({ name: "", description: "" });
    setModalOpen(true);
  };

  const openEdit = (skill) => {
    setEditingSkill(skill);
    setForm({ name: skill.name, description: skill.description || "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSkill(null);
    setForm({ name: "", description: "" });
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="users-container">
        <div className="users-header">
          <div>
            <h1>Skills</h1>
            <p className="subtitle">Gestión de habilidades</p>
          </div>
          <button className="primary-btn" onClick={openCreate}>
            + Nueva skill
          </button>
        </div>

        <div className="filters">
          <input
            placeholder="Buscar skill..."
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
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedSkills()).map(([group, list]) => (
                <>
                  {groupByInitial && (
                    <tr className="group-header">
                      <td colSpan="4">{group}</td>
                    </tr>
                  )}

                  {list.map((s) => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.name}</td>
                      <td>{s.description}</td>
                      <td>
                        <button onClick={() => openEdit(s)}>Editar</button>
                        <button onClick={() => handleDelete(s.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingSkill ? "Editar" : "Crear"} skill</h3>

            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <textarea
              placeholder="Descripción"
              value={form.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
            />

            <div className="modal-actions">
              <button onClick={closeModal}>Cancelar</button>
              <button onClick={handleSubmit}>
                {editingSkill ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Skills;