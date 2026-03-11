import type { LucideIcon } from "lucide-react";

export type Page = "login" | "register" | "dashboard";

export interface LoginPageProps {
  goRegister: () => void;
  goLogin: () => void;
}

export interface RegisterPageProps {
  goLogin: () => void;
}

export interface DashboardProps {
  goLogout: () => void;
}

export interface Asesoria {
  subject: string;
  asesor: string;
  emoji: string;
  time: string;
  date: string;
  status: "confirm" | "pending" | "cancel";
  color: string;
}

export interface Asesor {
  name: string;
  subject: string;
  rating: number;
  emoji: string;
  reviews: number;
}

export interface Materia {
  name: string;
  pct: number;
  color: string;
}

export interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  badge?: string;
  badgeColor?: string;
}