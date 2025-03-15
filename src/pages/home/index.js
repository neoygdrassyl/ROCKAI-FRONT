import { useContext } from "react";
import { AuthContext } from "../../utils/context/auth.context.ts";
import { useTranslation } from "react-i18next";

export default function Home() {

  const { t } = useTranslation();
  const authContext = useContext(AuthContext)
  const { user, verify } = authContext

  return (
    <div>
      <h1>Inicio</h1>
      <p>Usuario registrado: {user?.name || ''}</p>
      <p>Rol de usuario: {t(`users.role.${user?.cargo || ''}`)}</p>
      <div className="card">
        <div className="row">
          <div className="col border">
            <p>Permisos sobre Recursos humanos:</p>
          </div>
          <div className="col border">
              <ul>
                <li>VER: <strong>{verify({pathname: '/hr'}, "GET") ? "PERMITDO": "BLOQUEADO"}</strong></li>
                <li>CREAR: <strong>{verify({pathname: '/hr'}, "POST") ? "PERMITDO": "BLOQUEADO"}</strong></li>
                <li>ACTUALIZAR: <strong>{verify({pathname: '/hr'}, "PUT") ? "PERMITDO": "BLOQUEADO"}</strong></li>
                <li>ELIMINAR: <strong>{verify({pathname: '/hr'}, "DELETE") ? "PERMITDO": "BLOQUEADO"}</strong></li>
              </ul>
          </div>
        </div>
        <div className="row">
          <div className="col border">
            <p>Permisos sobre Proyectos:</p>
          </div>
          <div className="col border">
              <ul>
                <li>VER: <strong>{verify({pathname: '/pro'}, "GET") ? "PERMITDO": "BLOQUEADO"}</strong></li>
                <li>CREAR: <strong>{verify({pathname: '/pro'}, "POST") ? "PERMITDO": "BLOQUEADO"}</strong></li>
                <li>ACTUALIZAR: <strong>{verify({pathname: '/pro'}, "PUT") ? "PERMITDO": "BLOQUEADO"}</strong></li>
                <li>ELIMINAR: <strong>{verify({pathname: '/pro'}, "DELETE") ? "PERMITDO": "BLOQUEADO"}</strong></li>
              </ul>
          </div>
        </div>
      </div>

    </div>
  );
}