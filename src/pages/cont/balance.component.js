import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import transaccionesoService from "../../services/transacciones.service..js";
import TableApp from "../../utils/components/table.component.js";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../utils/context/auth.context.ts";
import { AppContext } from "../../utils/context/app.context.js";
import { useLocation } from "react-router";

export default function Balance(props) {
    const { refresh } = props
    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)
    const authContext = useContext(AuthContext)
    const appContext = useContext(AppContext)
    const { t } = useTranslation();
    const location = useLocation();

    function get_balance() {
        if (authContext.verify(location, "GET")) {
            setLoading(true);
            transaccionesoService.get_balance()
                .then(res => {
                    setData(res.data);

                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    setLoading(false);
                })
        } else {
            toast.warning(t('auth.nopermit'))
        }

    }

    useEffect(() => {
        get_balance()
    }, []);

    useEffect(() => {
        if(refresh) get_balance()
    }, [refresh]);

    const columns = [
        {
            name: t("balance.table.cuenta"),
            text: row => row.descripcion,
        },
        {
            name: t("balance.table.balance"),
            text: row => appContext.formatCurrency(row.balance),
        },
    ];

    return <div>
        <TableApp
            data={data}
            columns={columns}
            loading={isLoading}
            title={t("balance.table.title")}
            id="balance"
            reload={get_balance}
            noPag
            csv
            csvName={t("balance.table.csv")}
        />

    </div>
}