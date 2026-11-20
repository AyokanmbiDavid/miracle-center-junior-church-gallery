import {
  createContext,
  useContext,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [password, setPassword] = useState("");

  async function login(value) {
    const { data, error } = await supabase.functions.invoke(
      "admin-actions",
      {
        body: {
          action: "verify_admin",
          password: value,
        },
      }
    );

    if (error) throw error;
    if (!data?.success) {
      throw new Error(data?.error || "Invalid password.");
    }

    setPassword(value);
  }

  function logout() {
    setPassword("");
  }

  return (
    <AdminAuthContext.Provider
      value={{
        password,
        authenticated: Boolean(password),
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used inside AdminAuthProvider."
    );
  }

  return context;
}