import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import transaccionesoService from "../../services/transacciones.service..js";
import TableApp from "../../utils/components/table.component.js";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../utils/context/auth.context.ts";
import { AppContext } from "../../utils/context/app.context.js";
import { useLocation } from "react-router";
import { Button, Tooltip } from "@blueprintjs/core";
import ListInput from "../../utils/components/list.input.js";

export default function Wallet(props) {
    const { refresh } = props
    const [data, setData] = useState([])
    const [find, setFind] = useState('persona')
    const [isLoading, setLoading] = useState(false)
    const authContext = useContext(AuthContext)
    const appContext = useContext(AppContext)
    const { t } = useTranslation();
    const location = useLocation();

    function get_wallet() {
        if (authContext.verify(location, "GET")) {
            const field = document.getElementById('Wallet-options').value;
            const value = document.getElementById('Wallet-list-input').value;
            if (value != null && value !== '') {
                setLoading(true);
                transaccionesoService.get_wallet(field, value)
                    .then(res => {
                        setData(res.data);

                    })
                    .catch(error => appContext.errorHandler(error, toast, t))
                    .finally(() => {
                        setLoading(false);
                    })
            }
        } else {
            toast.warning(t('auth.nopermit'))
        }

    }

    async function getPairProyectos(search) {
        if (authContext.verify(location, "GET")) {
            return transaccionesoService.get_proyectos(search)
                .then(res => {
                    return res.data;
                })
                .catch(error => {
                    appContext.errorHandler(error, toast, t);
                    return []
                })
        } else {
            toast.warning(t('auth.nopermit'));
            return []
        }

    }

    async function getPairPersonas(search) {
        if (authContext.verify(location, "GET")) {
            return transaccionesoService.getPersonas(search)
                .then(res => {
                    return res.data;
                })
                .catch(error => {
                    appContext.errorHandler(error, toast, t);
                    return []
                })
        } else {
            toast.warning(t('auth.nopermit'));
            return []
        }

    };

    const onChangeSelect = (e) => {
        setFind(e.target.value)
    }

    useEffect(() => {
        if (refresh) get_wallet()
    }, [refresh]);


    const columns = [
        {
            name: t("wallet.table.fecha"),
            text: row => row.fecha,
        },
        {
            name: t("wallet.table.categoria"),
            text: row => t(`wallet.table.categorias.${row.categoria}`),
        },
        {
            name: t("wallet.table.descriccion"),
            text: row => row.descriccion,
        },
        {
            name: t("wallet.table.valor"),
            text: row => row.valor ? appContext.formatCurrency(row.valor) : null,
        },
        {
            name: t("wallet.table.balance"),
            text: row => row.balance ? appContext.formatCurrency(row.balance) : null,
        },
    ];


    const findComponent = () => {
        return <>
            <div className={`bp5-form-group mt-3 table-select pb-3 me-2`}>
                <div className="bp5-form-content">
                    <div className={`bp5-input-group`}>
                        <span className={`bp5-icon bp5-icon-filter`}></span>
                        <select id={`Wallet-options`} className="bp5-select" placeholder={t('table.filter')} dir="auto" onChange={onChangeSelect}>
                            <span className={`bp5-icon bp5-icon-chevron-down`}></span>
                            <option value={'persona'}>{t('wallet.table.persona')}</option>
                            <option value={'proyecto'}>{t('wallet.table.proyecto')}</option>
                        </select >
                    </div>
                </div>
            </div>
            <div className="me-2">
                <ListInput
                    api={find === 'persona' ? getPairPersonas : getPairProyectos}
                    id={`Wallet-list-input`}
                    placeholder={t('table.search')}
                    icon="search"
                    right={<Button intent="primary" icon="arrow-right" onClick={() => get_wallet()} />}
                    onKeyDown={(event) => { if (event.key === 'Enter') get_wallet() }}
                    useFill={false}
                />
            </div>
        </>
    }

    return <div>
        <TableApp
            data={data}
            columns={columns}
            loading={isLoading}
            title={t("wallet.table.title")}
            id="wallet"
            reload={get_wallet}
            noPag
            btn={findComponent()}
            csv
            csvName={t("wallet.table.csv").replace('%VAR%', document.getElementById(`Wallet-list-input-ignore`)?.value || '')}
        />

    </div>
}