import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  HeartHandshake,
  Users,
  Megaphone,
  LogOut,
  Menu,
  Brain,
  ClipboardList,
  HandCoins
} from "lucide-react";

import "./Sidebar.css";
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const sidebarRef = useRef(null);



const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Usuarios", icon: HeartHandshake, path: "/users" },
  { name: "Roles", icon: Users, path: "/roles" },
  { name: "Habilidades", icon: Brain, path: "/skills" },
  { name: "Campañas", icon: Megaphone, path: "/campaigns" },
  { name: "Postulantes a actividades", icon: ClipboardList, path: "/solicitudes" },
  { name: "Donaciones entrantes", icon: HandCoins, path: "/Donation-Incoming" }
];

  const logout = () => {
    if (!window.confirm("¿Cerrar sesión?")) return;
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <>
      <button className="menu-toggle" onClick={() => setOpen(!open)}>
        <Menu size={24} />
      </button>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}
      <aside ref={sidebarRef} className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-logo">
          <h2>Fundación</h2>
        </div>

        <nav className="sidebar-menu">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <div
                key={item.name}
                className={`menu-item ${active ? "active" : ""}`}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-home"
            onClick={() => {
              navigate("/");
              setOpen(false);
            }}
          >
            Ir al Inicio
          </button>

          <button className="logout" onClick={logout}>
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;