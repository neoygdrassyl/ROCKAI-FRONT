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
import TerceroShowMore from "../hr/personaShow.component.js";

export default function Wallet(props) {
    const { refresh } = props
    const [dataW, setData] = useState([])
    const [dataT, setDataT] = useState([])
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
                        data2 = res.data.filter(d => d.es_subitem === 0);
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

    function getRelationComponent(row) {
        if (row.id_persona && row.id_proyecto) return <>
            <TerceroShowMore id={row.id_persona} text={t('wallet.table.persona')} icon={"person"} />
            {" | "}
            <ProyectoShowMore id={row.id_proyecto} text={t('wallet.table.proyecto')} icon={'projects'} />
        </>;
        if (row.id_persona) return <>
            <TerceroShowMore id={row.id_persona} text={t('wallet.table.persona')} icon={"person"} />
        </>;
        if (row.id_proyecto) return <>
            <ProyectoShowMore id={row.id_proyecto} text={t('wallet.table.proyecto')} icon={'projects'} />
        </>;
        return '';

    }

    useEffect(() => {
        if (refresh) get_wallet()
    }, [refresh]);


    const columns = [
        {
            name: t("wallet.table.fecha"),
            text: row => row.fecha,
            width: "150px",
        },
        {
            name: t("wallet.table.categoria"),
            text: row => t(`wallet.table.categorias.${row.categoria}`),
        },
        {
            name: t("wallet.table.relacion"),
            text: row => null,
            component: row => getRelationComponent(row),
            omitCsv: true,
        },
        {
            name: t("wallet.table.descriccion"),
            text: row => row.descriccion,
        },
        {
            name: t("wallet.table.valor"),
            text: row => row.valor ? appContext.formatCurrency(row.valor) : null,
            width: "150px",
        },
        {
            name: t("wallet.table.abonos"),
            text: row => row.abonos ? appContext.formatCurrency(row.abonos) : null,
            width: "150px",
        },
        {
            name: t("wallet.table.balance"),
            component: row => <>
                {row.balance < 0 ? <label className="text-danger">{appContext.formatCurrency(row.balance)}</label> : null}
                {row.balance > 0 ? <label className="text-success">{appContext.formatCurrency(row.balance)}</label> : null}
            </>,
            text: row => row.balance ? appContext.formatCurrency(row.balance) : null,
            width: "150px",
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
        let total = 0;
        let local_data = []
        if (data.categoria === "50_servicio")
            local_data = [...dataW.filter(d => d.es_subitem === 1 && d.id_proyecto === data.id_proyecto && d.id_persona === data.id_persona)];
        else if (data.categoria === "20_pro")
            local_data = [...dataW.filter(d => d.es_subitem === 1 && d.id_proyecto === data.id_proyecto)];
        else return
        total = [...local_data].reduce((sum, curr) => sum + Number(curr.valor), 0);
        if (total === 0) return
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
                {local_data.map((row, n) => (
                    <tr>
                        <th scope="row">{n + 1}</th>
                        <td>{row.fecha}</td>
                        <td>
                            {t('wallet.table.trax') + " " + row.descriccion}
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
            expandDisable={row => !(row.categoria === '20_pro' || row.categoria === '50_servicio')}
        />

    </div>
}