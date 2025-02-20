import { useEffect } from "react";
import { useUser, User } from "./user.hook.ts";
import { useLocalStorage } from "./storage.hook.ts";

export const useAuth = () => {
  const { user, addUser, removeUser, setUser } = useUser();
  const { getItem } = useLocalStorage();

  useEffect(() => {
    const user = getItem("rockai-user");
    if (user != null && user) {
      console.log(user)
      addUser(JSON.parse(user));
    }
  }, [addUser, getItem]);

  const login = (user: User) => {
    addUser(user);
  };

  const logout = () => {
    removeUser();
  };

  return { user, login, logout, setUser };
};
