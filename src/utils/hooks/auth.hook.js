import { useState } from "react";
import vars from "../json/variables.json"

const KEY_STORAGE = process.env.REACT_APP_STORAGE_KEY
const KEY_TOKEN = process.env.REACT_APP_TOKEN_KEY

export const useAuth = () => {
  const [user, setUser] = useState(null);

  const loadUser = () => {
    const _user = localStorage.getItem(KEY_STORAGE);
    if (_user) setUser(JSON.parse(_user));
    return JSON.parse(_user);
  };

  const login = (_user) => {
    setUser(_user);
    localStorage.setItem(KEY_STORAGE, JSON.stringify(_user));
    localStorage.setItem(KEY_TOKEN, _user.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY_STORAGE);
    localStorage.removeItem(KEY_TOKEN);
  };

  const verify = (location, action) => {
    if(!user) return false;
    const ACCESS = user.access
    const MODULE = location.pathname

    const MODULES = {
      [vars.mod_map.COT.url]: "COT", // MODULO DE COTIZACIONES
      [vars.mod_map.PRO.url]: "PRO", // MODULO DE PROYECTOS
      [vars.mod_map.CON.url]: "CON", // MODULO DE CONTABILIDAD
      [vars.mod_map.HRS.url]: "HRS", // MODULO DE RECURSOS HUMANOS
      [vars.mod_map.PRS.url]: "PRS", // PROCESOS VARIOS, START PAGE ETC...
      [vars.mod_map.EXP.url]: "EXP", // EJECUTABLES DE UN PROYECTO
      [vars.mod_map.ENP.url]: "ENP", // ENTREGABLES DE UN PROYECTO
    };

    const ACTIONS = {
      GET: 1,
      POST: 2,
      PUT: 3,
      DELETE: 4,
    };

    const CHECK_MODULE = ACCESS.find(access => MODULES[MODULE] === access.split(":")[0])

    if (!CHECK_MODULE) return false

    return (Number(CHECK_MODULE.split(":")[1]) >= ACTIONS[action])

  }

  return { login, logout, user, verify, loadUser};
};
