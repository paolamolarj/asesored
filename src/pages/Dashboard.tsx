import { useEffect, useState } from "react";
import type { DashboardProps } from "../types";
import AlumnoDashboard from "./AlumnoDashboard";
import AsesorDashboard from "./AsesorDashboard";
import AdminDashboard from "./AdminDashboard";

interface LoggedUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

export default function Dashboard({ goLogout }: DashboardProps) {
  const [user, setUser] = useState<LoggedUser | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("asesored_user");

    if (!savedUser) {
      goLogout();
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    } catch (error) {
      localStorage.removeItem("asesored_user");
      goLogout();
    }
  }, [goLogout]);
  useEffect(() => {
  async function generarRecordatorios() {
    try {
      await fetch("http://localhost/asesored-api/generar_recordatorios.php", {
        method: "POST",
      });
    } catch (error) {
      console.error("No se pudieron generar recordatorios");
    }
  }

  generarRecordatorios();
}, []);

  if (!user) return null;

  if (user.rol === "admin") {
    return <AdminDashboard goLogout={goLogout} user={user} />;
  }

  if (user.rol === "asesor") {
    return <AsesorDashboard goLogout={goLogout} user={user} />;
  }

  return <AlumnoDashboard goLogout={goLogout} user={user} />;
}