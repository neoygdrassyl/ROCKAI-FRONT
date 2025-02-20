import { useContext } from "react";
import { AuthContext } from "./auth.context.ts";
import { useLocalStorage } from "./storage.hook.ts";

export interface User {
  id: string;
  name: string;
  email?: string;
  authToken?: string;
  permits?: string;
}

export const useUser = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setItem } = useLocalStorage();

  const addUser = (user: User) => {
    setUser(user);
    setItem("rockai-user", JSON.stringify(user));
  };

  const removeUser = () => {
    setUser(null);
    setItem("rockai-user", "");
  };

  return { user, addUser, removeUser, setUser };
};
