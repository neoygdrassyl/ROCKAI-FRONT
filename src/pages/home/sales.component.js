import { useEffect, useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import TableApp from '../../utils/components/table.component.js';
import { AuthContext } from '../../utils/context/auth.context.ts';
import { AppContext } from '../../utils/context/app.context.js';
import processService from '../../services/process.service.js';
import { ProgressBar } from '@blueprintjs/core';


export default function PRS_SALES() {
    const [isLoading, setLoading] = useState(false)
    const [items, setItems] = useState([])
    const authContext = useContext(AuthContext)
    const appContext = useContext(AppContext)
    const { t } = useTranslation();

    const toastWarning = (msg) => toast.warning(msg);

    function getSales() {
        if (authContext.verify({ pathname: "/prs" }, "GET")) {
            setLoading(true);
            processService.get_sales()
                .then(res => {
                    setItems(res.data);
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    setLoading(false);
                })
        } else {
            toastWarning(t('auth.nopermit'))
        }

    }

    useEffect(() => {
        getSales()
    }, []);


    const columns = [
        {
            name: t("prs.table.sale_fecha"),
            text: row => row.date || t("prs.table.no_fecha"), 
        },
        {
            name: t("prs.table.sale_n"),
            text: row => row.sale_n,
        },
        {
            name: t("prs.table.sale_value"),
            text: row => appContext.formatCurrency(row.sale_value),
        },
        {
            name: t("prs.table.sale_index"),
            text: row => row.sale_index,
            component: row => <div className="row">
                <div className="col index-component-v">{Math.round(row.sale_index * 100)}%</div>
                <div className="col index-component mt-1 ms-1"><ProgressBar intent={row.sale_index >= 1 ? "success" : "primary"} value={row.sale_index >= 1 ? 1 : row.sale_index} animate={false} /> </div>
            </div>
        },
    ];


    return (
        <div>
            <ToastContainer theme="colored" />

            <TableApp
                data={items}
                columns={columns}
                loading={isLoading}
                title={t("prs.sale_title")}
                id="sales"
                noPag
            />



        </div>

    );
}
