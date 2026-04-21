import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import InteractiveBackground from "../../components/InteractiveBackground";
import { motion } from "framer-motion";
import "../home.css"; // reutilizamos estilos base
import "./Volunteers.css";
import Tilt from "react-parallax-tilt";
import { useNavigate } from "react-router-dom";



function Volunteers() {
    const [volunteers, setVolunteers] = useState([]);


    const centerIndex = Math.floor(volunteers.length / 2);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const isVolunteer = user?.role?.name === "Voluntario";
    const [profileImage, setProfileImage] = useState(null);
    
    const navigate = useNavigate();


    const [formDataState, setFormDataState] = useState({
    apellido: "",
    telefono: "",
    direccion: ""
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const [previewImage, setPreviewImage] = useState(null);
    const [documentFile, setDocumentFile] = useState(null);
    const [previewDoc, setPreviewDoc] = useState(null);
    const validateField = (name, value) => {
        let error = "";

        if (name === "apellido") {
            if (!value) error = "Requerido";
            else if (value.length < 3) error = "Muy corto";
        }

        if (name === "telefono") {
            if (!value) error = "Requerido";
            else if (!/^[0-9]{7,8}$/.test(value)) error = "Teléfono inválido";
        }

        if (name === "direccion") {
            if (!value) error = "Requerido";
        }

        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
    const { name, value } = e.target;

        setFormDataState(prev => ({
            ...prev,
            [name]: value
        }));

        validateField(name, value);
        };

        const handleBlur = (e) => {
        const { name } = e.target;

        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProfileImage(file);
        setPreviewImage(URL.createObjectURL(file));
        };

        const handleDocChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setDocumentFile(file);
        setPreviewDoc(file.name);
    };


    const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("access");

    const formData = new FormData();
    if (profileImage) {
        formData.append("profile_image", profileImage);
    }

        try {
            const res = await fetch("http://localhost:8000/api/users/me/", {
            method: "PATCH", // o PUT
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
            });

            const data = await res.json();
            console.log("ACTUALIZADO:", data);
        } catch (err) {
            console.error(err);
        }
    
        const isValid = Object.values(errors).every(e => !e) &&
                Object.values(formDataState).every(v => v);

if (!isValid) {
  alert("Completa correctamente el formulario");
  return;
}
    };





    useEffect(() => {
    fetch("http://localhost:8000/api/users/?role=Voluntario")
        .then(res => res.json())
        .then(data => {
        console.log("VOLUNTARIOS:", data); // 🔥 DEBUG CLAVE
        setVolunteers(data);
        })
        .catch(err => console.error("ERROR:", err));
    }, []);
    console.log("USER COMPLETO:", user);
    console.log("ROL:", user?.role);
    console.log("IS VOLUNTEER:", isVolunteer);
    
    useEffect(() => {
    const token =
    localStorage.getItem("token") ||
    localStorage.getItem("access");

    if (!token) {
        setUser(null);
        setLoadingUser(false);
        return;
    }

  fetch("http://localhost:8000/api/users/me/", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("No autenticado");
      return res.json();
    })
    .then(data => {
      console.log("USER DATA:", data);
      setUser(data);
    })
    .catch(() => {
      setUser(null);
    })
    .finally(() => setLoadingUser(false));
}, []);




  return (
    <div className="home"> {/* 🔥 misma clase que Home */}
      <InteractiveBackground />
      <Navbar />

      {/* HERO SIMPLE */}
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="hero-text">
          <h1>Voluntarios</h1>
          <p>
            Personas comprometidas que están generando impacto en la comunidad.
          </p>
        </div>
      </motion.section>

      {/* LISTA DE VOLUNTARIOS */}
      <section className="about">
        <h2>Lista de voluntarios</h2>

        <motion.div
          className="volunteers-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {volunteers.length === 0 ? (
  <p>No hay voluntarios aún</p>
) : (
volunteers.map((v, i) => (
  <Tilt
    key={v.id}
    glareEnable={true}
    glareMaxOpacity={0.3}
    scale={1.05}
    transitionSpeed={2500}
    tiltMaxAngleX={10}
    tiltMaxAngleY={10}
  >
    <motion.div
      className="volunteer-card"
      initial={{
        opacity: 0,
        scale: 0.5,
        y: 50
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }}
      whileHover={{
        scale: 1.08,
        rotate: 1
      }}
      whileTap={{
        scale: 0.95
      }}
      transition={{
        delay: Math.abs(i - centerIndex) * 0.1,
        type: "spring",
        stiffness: 120
      }}
    >
      <div className="card-glow"></div>

        <img
        src={
            v.profile_image
            ? `http://localhost:8000${v.profile_image}`
            : `https://ui-avatars.com/api/?name=${v.username}`
        }
        alt={v.username}
        />

      <h3>{v.username}</h3>
      <p>{v.email}</p>

      {v.profile && (
        <span className="badge">
          {v.profile.ciudad}, {v.profile.pais}
        </span>
      )}
    </motion.div>
  </Tilt>
))
    )}
        </motion.div>
      </section>

      {/* CTA IGUAL QUE HOME */}
        <section className="cta">
        <h2>¿Quieres unirte como voluntario?</h2>
        <p>Forma parte del cambio.</p>

<button
  className="btn-primary"
  disabled={loadingUser}
    onClick={() => {
    if (loadingUser) return;

    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("access");

    if (!token) {
        navigate("/login");
        return;
    }

    setShowModal(true);
    }}
>
  {loadingUser ? "Cargando..." : "Convertirme en Voluntario"}
</button>
        </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <h3>Fundación Solidaria</h3>
          <p>Ayudando a comunidades vulnerables con tecnología.</p>
        </div>
      </footer>


      {showModal && (
        <div className="modal-overlay">
          <motion.div
            className="modal modern-modal"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ✖
            </button>

            {/* HEADER */}
            <div className="modal-header">
              <img
              src={
                  user?.profile_image
                  ? `http://localhost:8000${user.profile_image}`
                  : `https://ui-avatars.com/api/?name=${user?.username}`
              }
              alt="perfil"
              />
              <div>
                <h2>{user?.username}</h2>
                <p>{user?.email}</p>
              </div>
            </div>

            {isVolunteer  ? (
              <div className="modal-content">
                <h3>Perfil de voluntario</h3>

                <div className="info-grid">
                  <div>
                    <span>Ciudad</span>
                    <p>{user.profile?.ciudad || "-"}</p>
                  </div>

                  <div>
                    <span>País</span>
                    <p>{user.profile?.pais || "-"}</p>
                  </div>

                  <div>
                    <span>Horas disponibles</span>
                    <p>{user.profile?.available_hours_per_week || 0}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form className="modal-form" onSubmit={handleSubmit}>
                <h3>Solicitud de voluntariado</h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      placeholder="Tu apellido"
                      value={formDataState.apellido}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.apellido && touched.apellido ? "input-error" : ""}
                      />
                      {touched.apellido && errors.apellido && (
                      <span className="error-text">{errors.apellido}</span>
                      )}
                  </div>

                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      value={formDataState.telefono}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.telefono && touched.telefono ? "input-error" : ""}
                    />
                    {touched.telefono && errors.telefono && (
                      <span className="error-text">{errors.telefono}</span>
                    )}
                  </div>

                  <div className="form-group full">
                    <label>Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      value={formDataState.direccion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.direccion && touched.direccion ? "input-error" : ""}
                    />
                    {touched.direccion && errors.direccion && (
                      <span className="error-text">{errors.direccion}</span>
                    )}
                  </div>
                </div>

                {/* UPLOADS BONITOS */}
                <div className="upload-section">
                
      
                  <label className="upload-box">
                    {previewImage ? (
                      <img src={previewImage} className="preview-img" />
                    ) : (
                      "Subir foto de perfil"
                    )}

                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>

                  <label className="upload-box">
                    {previewDoc ? (
                      <span className="file-name">{previewDoc}</span>
                    ) : (
                      "Documento (CI/Pasaporte)"
                    )}

                    <input
                      type="file"
                      hidden
                      onChange={handleDocChange}
                    />
                  </label>
                </div>

                <button type="submit" className="btn-primary submit-btn">
                  Enviar solicitud
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );

}
export default Volunteers;