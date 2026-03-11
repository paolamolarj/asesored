import {
  Home,
  Search,
  Calendar,
  MessageSquare,
  BarChart2,
  Users,
  BookOpen,
  Clock,
} from "lucide-react";
import type { NavItem } from "../types";

export const alumnoNavItems: NavItem[] = [
  { id: "inicio", icon: Home, label: "Inicio" },
  { id: "buscar", icon: Search, label: "Buscar asesor" },
  { id: "citas", icon: Calendar, label: "Mis asesorías" },
];

export const asesorNavItems: NavItem[] = [
  { id: "inicio", icon: Home, label: "Inicio" },
  { id: "materias", icon: BookOpen, label: "Mis materias" },
  { id: "horarios", icon: Clock, label: "Mis horarios" },
  { id: "solicitudes", icon: Users, label: "Solicitudes" },
  { id: "citas", icon: Calendar, label: "Mis asesorías" },
];