import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios.instance";
import type { User } from "./UserContext.instance";
import { UserContext } from "./UserContext.instance";
import type { ReactNode } from "react";
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async (): Promise<User | null> => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data);
      return res.data;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, setUser, refreshUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
