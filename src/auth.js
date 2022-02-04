import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/firebase";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return "Web Chat Pingo Loadiing... ";
  }
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
