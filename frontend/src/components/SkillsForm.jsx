import { useEffect, useState } from "react";
import { getSkills } from "../services/skillService";

export default function SkillsForm({ value = [], onChange }) {
  const [availableSkills, setAvailableSkills] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSkills = async () => {
      const data = await getSkills(token);
      setAvailableSkills(data);
    };

    fetchSkills();
  }, []);

  const addSkill = () => {
    onChange([
      ...value,
      {
        skill_id: null,
        required_level: 50,
        is_mandatory: true,
      },
    ]);
  };

  const updateSkill = (index, field, val) => {
    const updated = [...value];
    updated[index][field] = val;
    onChange(updated);
  };

  const removeSkill = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="skills-container">
      <button type="button" className="skill-add-btn" onClick={addSkill}>
        + Añadir skill
      </button>

      {value.map((s, index) => (
        <div key={index} className="skill-card">

          {/* SELECT */}
          <select
            value={s.skill_id || ""}
            onChange={(e) =>
              updateSkill(
                index,
                "skill_id",
                e.target.value ? Number(e.target.value) : null
              )
            }
          >
            <option value="">Selecciona skill</option>
            {availableSkills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>

          {/* NIVEL */}
          <input
            type="number"
            min="1"
            max="100"
            value={s.required_level}
            onChange={(e) =>
              updateSkill(index, "required_level", Number(e.target.value))
            }
            placeholder="Nivel"
          />

          {/* CHECK */}
          <label className="skill-checkbox">
            <input
              type="checkbox"
              checked={s.is_mandatory}
              onChange={(e) =>
                updateSkill(index, "is_mandatory", e.target.checked)
              }
            />
            Obligatorio
          </label>

          {/* DELETE */}
          <button
            type="button"
            className="skill-delete-btn"
            onClick={() => removeSkill(index)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}