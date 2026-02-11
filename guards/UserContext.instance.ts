import { createContext } from "react";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "manager" | "waiter" | "cook" | null;
  is_active: "active" | "inactive";
  is_superadmin: boolean;
}

export interface UserContextProps {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<User | null>;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined,
);
