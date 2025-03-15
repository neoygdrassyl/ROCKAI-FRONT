import { useContext } from "react";
import { AuthContext } from "../../utils/context/auth.context.ts";
import { useTranslation } from "react-i18next";
import Cuentas from "./cuentas.component.js";

export default function Contabilidad() {

  const { t } = useTranslation();
  const authContext = useContext(AuthContext)
  const { user, verify } = authContext

  return (
    <div>
      <h2>Contabilidad y Registros</h2>


      <h3>Saldo Disponible</h3>
      <hr/>

      <h3>Ingresos / Egresos</h3>
      <hr/>
      
      <Cuentas />

      <h3>Estado de cartera</h3>
      <hr/>
    </div>
  );
}