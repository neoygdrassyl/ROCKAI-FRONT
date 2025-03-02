import { useEffect, useState } from "react";
import vars from "../json/variables.json"

const KEY_STORAGE = process.env.REACT_APP_STORAGE_KEY

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const _user = localStorage.getItem(KEY_STORAGE);
    if (_user) {
      setUser(JSON.parse(_user));
    }
  }, []);

  const login = (_user) => {
    setUser(_user);
    localStorage.setItem(KEY_STORAGE, JSON.stringify(_user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY_STORAGE);
  };

  const verify = (location, action) => {

    const ACCESS = user.access
    const MODULE = location.pathname

    const MODULES = {
        [vars.mod_map.COT.url]: "COT",
        [vars.mod_map.PRO.url]: "PRO",
        [vars.mod_map.CON.url]: "CON",
        [vars.mod_map.HRS.url]: "HRS",
    };

    const ACTIONS = {
        GET: 1,
        POST: 2,
        PUT: 3,
        DELETE: 4,
    };

    const CHECK_MODULE =  ACCESS.find(access => MODULES[MODULE] === access.split(":")[0])

    if(!CHECK_MODULE) return false

    return ( Number(CHECK_MODULE.split(":")[1]) >= ACTIONS[action] )
 
}

  return { login, logout, user, verify };
};
