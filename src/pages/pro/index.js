import { useTranslation } from 'react-i18next';
import Proyectos from './proyecto.component.js';
import { ToastContainer } from 'react-toastify';

export default function PRO() {
    const { t } = useTranslation();

    return (
        <div>
            <h2>{t("pro.title")}</h2>
            <ToastContainer theme="colored" />

            <Proyectos />

        </div>

    );
}
