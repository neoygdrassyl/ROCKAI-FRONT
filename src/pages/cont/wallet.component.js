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
import ProyectoShowMore from "../pro/proyectoShow.component.js";

export default function Wallet(props) {
    const { refresh } = props
    const [dataW, setData] = useState([])
    const [dataT, setDataT] = useState([])
    const [short, setShort] = useState(false)
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

                        let data2 = res.data
                        let data = res.data
                        let has_pro = data.find(d => d.categoria === "10_pro");

                       
                        if (!has_pro) {
                            setShort(true)
                        }
                        else {
                            data2 = res.data.filter(d => d.es_subitem === 0);
                            setShort(false)
                        }
                        data2 = data2.filter(d => Number(d.valor) !== 0 || d.categoria === "balance_total");
                        setData(data);
                        setDataT(data2);

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
            component: row => (row.categoria || '').includes('10_pro')
                ? <ProyectoShowMore id={row.id_proyecto} text={row.descriccion} icon={'projects'} />
                : row.descriccion
        },
        {
            name: t("wallet.table.valor"),
            component: row => <>
                {row.valor < 0 ? <label className="text-danger">{appContext.formatCurrency(row.valor)}</label> : null}
                {row.valor > 0 ? <label className="text-success">{appContext.formatCurrency(row.valor)}</label> : null}
            </>,
            text: row => row.valor ? appContext.formatCurrency(row.valor) : null,
        },
        {
            name: t("wallet.table.balance"),
            component: row => <>
                {row.balance < 0 ? <label className="text-danger">{appContext.formatCurrency(row.balance)}</label> : null}
                {row.balance > 0 ? <label className="text-success">{appContext.formatCurrency(row.balance)}</label> : null}
            </>,
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

    const conditionalRowStyles = [
        {
            when: row => row.es_total,
            style: {
                backgroundColor: '#eaecee',
                color: "#5e4239",
                '&:hover': {
                    cursor: 'pointer',
                },
                fontWeight: "bold"
            },
        },
    ]

    const expand = ({ data }) => {
        if (short) return null
        let total = 0;
        total = dataW.filter(d => d.es_subitem === 1 && d.id_proyecto === data.id_proyecto).reduce((sum, curr) => sum + Number(curr.valor), 0)
        return <table class="table table-sm">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">{t("wallet.table.fecha")}</th>
                    <th scope="col">{t("wallet.table.descriccion")}</th>
                    <th scope="col">{t("wallet.table.valor")}</th>
                </tr>
            </thead>
            <tbody>
                {dataW.filter(d => d.es_subitem === 1 && d.id_proyecto === data.id_proyecto).map((row, n) => (
                    <tr>
                        <th scope="row">{n + 1}</th>
                        <td>{row.fecha}</td>
                        <td>
                            {row.categoria == "50_servicio" ? t('wallet.table.categorias.50_servicio') : ""}
                            {row.categoria == "20_abono" ? t('wallet.table.categorias.20_abono') : ""}
                            {" " + row.descriccion}
                        </td>
                        <td>{appContext.formatCurrency(row.valor)}</td>
                    </tr>
                ))}
                <tr>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">{t(`wallet.table.categorias.balance_total`)}</th>
                    <th scope="col">{appContext.formatCurrency(total)}</th>
                </tr>
            </tbody>
        </table>
    };

    return <div>
        <TableApp
            data={dataT}
            columns={columns}
            loading={isLoading}
            title={t("wallet.table.title")}
            id="wallet"
            reload={get_wallet}
            noPag
            btn={findComponent()}
            csv
            csvdata={dataW}
            csvName={t("wallet.table.csv").replace('%VAR%', document.getElementById(`Wallet-list-input-ignore`)?.value || '')}
            conditionalRowStyles={conditionalRowStyles}
            expand={expand}
            expandDisable={row => !(row.categoria === '10_pro')}
        />

    </div>
}