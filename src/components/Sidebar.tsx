// src/components/Sidebar.tsx
import { useState, useEffect } from "react";
import "./Sidebar.css";

interface SidebarProps {
  user: { nombre: string; rol: string };
  goLogout: () => void;
}

export default function Sidebar({ user, goLogout }: SidebarProps) {
  const [activeSection, setActiveSection] = useState("Inicio");

  // Scroll observer
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.6 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="logo">AsesoRed</span>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={activeSection === "Inicio" ? "active" : ""}>Inicio</li>
          <li className={activeSection === "BuscarAsesor" ? "active" : ""}>Buscar asesor</li>
          <li className={activeSection === "MisAsesorias" ? "active" : ""}>Mis asesorías</li>
          <li className={activeSection === "Calificaciones" ? "active" : ""}>Calificaciones</li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={goLogout}>Cerrar sesión</button>
      </div>
    </aside>
  );
}