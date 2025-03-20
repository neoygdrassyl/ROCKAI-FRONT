import { useState } from "react";
import { useTranslation } from "react-i18next";
import Cuentas from "./cuentas.component.js";
import Transacciones from "./trax.component.js";
import Balance from "./balance.component.js";
import { ToastContainer } from "react-toastify";
import Wallet from "./wallet.component.js";

export default function Contabilidad() {
  const { t } = useTranslation();
  const [refresh, serRefresh] = useState(false)

  return (
    <div>
      <ToastContainer theme="colored" />
      <h2>{t('con.title')}</h2>

      <Balance refresh={refresh} />

      <Transacciones refresh={refresh} serRefresh={serRefresh} />

      <Cuentas refresh={refresh} serRefresh={serRefresh} />

      <Wallet refresh={refresh} />

    </div>
  );
}