import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("ttm_token"));
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!token) {
        setAuthReady(true);
        return;
      }

      try {
        const { data } = await api.get("/auth/profile");
        setUser(data);
      } catch (error) {
        localStorage.removeItem("ttm_token");
        setToken(null);
        setUser(null);
      } finally {
        setAuthReady(true);
      }
    };

    bootstrapAuth();
  }, [token]);

  const persistAuth = (payload) => {
    localStorage.setItem("ttm_token", payload.token);
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (formData) => {
    const { data } = await api.post("/auth/login", formData);
    persistAuth(data);
    toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
  };

  const signup = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    persistAuth(data);
    toast.success("Your account is ready.");
  };

  const logout = () => {
    localStorage.removeItem("ttm_token");
    setToken(null);
    setUser(null);
    toast.success("You have been logged out.");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      authReady,
      isAdmin: user?.role === "admin",
      login,
      signup,
      logout,
      setUser,
    }),
    [authReady, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
};
