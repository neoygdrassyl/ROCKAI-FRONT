import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { Alert, Button, ButtonGroup, Dialog, DialogBody, Tooltip } from '@blueprintjs/core';
import { AuthContext } from "../../utils/context/auth.context.ts";
import { AppContext } from "../../utils/context/app.context.js";
import transaccionesoService from "../../services/transacciones.service..js";
import TableApp from "../../utils/components/table.component.js";
import FormComponent from "../../utils/components/form.component.js";
import Vars from "../../utils/json/variables.json"
import ProyectoShowMore from "../pro/proyectoShow.component.js";
import TerceroShowMore from "../hr/personaShow.component.js";

export default function Transacciones(props) {
    const { refresh, serRefresh } = props
    const [data, setData] = useState([])
    const [item, setItem] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [alert, setAlert] = useState(false)
    const [modal, setModal] = useState(false)
    const [traxRelation, selecTraxRelation] = useState(null)
    const [traxRelationEdit, selecTraxRelationEdit] = useState(null)
    const authContext = useContext(AuthContext)
    const appContext = useContext(AppContext)
    const location = useLocation()
    const { t } = useTranslation();
    const toastInfo = (msg) => toast.info(msg, { autoClose: 1500, theme: "light", });

    function list(page = 1, pageSize = 20, field = null, value = null) {
        if (authContext.verify(location, "GET")) {
            setLoading(true);
            if (field && value) transaccionesoService.search(page, pageSize, field, value)
                .then(res => {
                    setData(res.data);
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    setLoading(false);
                })
            else transaccionesoService.list(page, pageSize)
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

    function get(i) {
        if (authContext.verify(location, "GET")) {
            transaccionesoService.get(i.id)
                .then(res => {
                    setItem(res.data);
                    if (res.data.persona && res.data.proyecto) selecTraxRelationEdit('doble');
                    else if (res.data.cuenta_2) selecTraxRelationEdit('trax')
                    else if (res.data.persona) selecTraxRelationEdit('persona');
                    else if (res.data.proyecto) selecTraxRelationEdit('pro');
                    setModal(true);
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {

                })
        } else {
            toast.warning(t('auth.nopermit'))
        }

    }

    function create(form) {
        if (authContext.verify(location, "POST")) {
            setModal(false);
            toastInfo(t('actions.procesing'));
            transaccionesoService.create(form)
                .then(res => {
                    if (res.data) {
                        toast.dismiss();
                        toast.success(t('actions.creaated'));
                    }
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    serRefresh(!refresh);
                })
        } else {
            toast.warning(t('auth.nopermit'));
        }

    }

    function edit(id, form) {
        if (authContext.verify(location, "PUT")) {
            setModal(false);
            toastInfo(t('actions.procesing'))
            transaccionesoService.update(form, id)
                .then(res => {
                    if (res.data) {
                        toast.dismiss();
                        toast.success(t('actions.edited'));
                    }
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    serRefresh(!refresh);
                })
        } else {
            toast.warning(t('auth.nopermit'))
        }

    }

    function remove(id) {
        if (authContext.verify(location, "DELETE")) {
            setModal(false);
            toastInfo(t('actions.procesing'))
            transaccionesoService.delete(id)
                .then(res => {
                    if (res.data) {
                        toast.dismiss();
                        toast.success(t('actions.deleted'));
                    }
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    serRefresh(!refresh);
                })
        } else {
            toast.warning(t('auth.nopermit'))
        }

    }

    async function list_csv(field = null, value = null) {
        if (authContext.verify(location, "GET")) {
            toastInfo(t('actions.procesing'));
            if (field && value) return transaccionesoService.search(1, 9999999, field, value)
                .then(res => (
                    res.data
                ))
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => toast.dismiss())
            else return transaccionesoService.list(1, 9999999)
                .then(res => (
                    res.data
                ))
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => toast.dismiss())
        } else {
            toast.warning(t('auth.nopermit'))
        }

    }

    async function getPairCuentas(search, apiExt) {
        if (authContext.verify(location, "GET")) {
            return transaccionesoService.get_cuentas(search, apiExt.origin)
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

    }

    function getRelation(trax) {
        if (trax) {
            if (traxRelationEdit === "trax") return "trax";
            else if (traxRelationEdit === "persona") return "persona";
            else if (traxRelationEdit === "pro") return "pro";
            else if (traxRelationEdit === "doble") return "doble";
            else return traxRelation;
        }
        return traxRelation;
    }

    function getRelationComponent(trax) {
        if (trax.cuenta_2) return <>
            <Tooltip content={t("trax.table.cuenta_1")} placement="top">
                <><span className={`bp5-icon bp5-icon-bank-account text-primary`} /></>
            </Tooltip>
            {` ${trax.cuenta_2}`}
        </>;
        if (trax.id_persona && trax.id_proyecto) return <>
            <TerceroShowMore id={trax.id_persona} text={trax.persona} icon={"person"} />
            {" | "}
            <ProyectoShowMore id={trax.id_proyecto} text={trax.proyecto} icon={'projects'} />

        </>;
        if (trax.persona) return <>
            {trax.id_persona ?
                <TerceroShowMore id={trax.id_persona} text={trax.persona} icon={"person"} /> : trax.persona}

        </>;
        if (trax.id_proyecto) return <>
            <ProyectoShowMore id={trax.id_proyecto} text={trax.proyecto} icon={'projects'} />
        </>;
        return '';

    }

    function getRelationText(trax) {
        let text = "";
        if (trax.cuenta_2) text += trax.cuenta_2 + " ";
        if (trax.persona) text += trax.persona + " ";
        if (trax.proyecto) text += trax.proyecto
        return text;
    }

    useEffect(() => {
        list();
    }, []);

    useEffect(() => {
        if (refresh) list()
    }, [refresh]);

    const columns = [
        {
            name: t("actions.action"),
            width: '120px',
            omitCsv: true,
            component: row => <>
                <ButtonGroup>
                    {authContext.verify(location, "PUT") ? <>
                        <Tooltip content={t('actions.edit')} placement="top">
                            <Button icon="edit" intent='warning' onClick={() => get(row)} />
                        </Tooltip>
                    </>
                        : null}
                    {authContext.verify(location, "DELETE") ?
                        <Tooltip content={t('actions.delete')} placement="top">
                            <Button icon="trash" intent='danger' onClick={() => {
                                setItem(row);
                                setAlert(true);
                            }} />
                        </Tooltip>
                        : null}
                </ButtonGroup>
            </>,
        },
        {
            name: t("trax.table.id"),
            value: "id",
            width: '120px',
            text: row => row.id
        },
        {
            name: t("trax.table.fecha"),
            value: "fecha",
            text: row => row.fecha
        },
        {
            name: t("trax.table.descripcion"),
            value: "descripcion",
            text: row => row.descripcion,
        },

        {
            name: t("trax.table.relacion"),
            component: row => getRelationComponent(row),
            text: row => getRelationText(row),
        },
        {
            name: t("trax.table.monto"),
            text: row => appContext.formatCurrency(row.monto),
            component: row => <>
                <Tooltip content={t("general.trax_type." + row.tipo_trax)} placement="top">
                    <><span className={`me-1 bp5-icon bp5-icon-${row.tipo_trax === 'I' ? 'input' : 'output'} text-${row.tipo_trax === 'I' ? 'success' : 'danger'}`} /></>
                </Tooltip>
                {row.es_prestamo === 1 ?
                    <Tooltip content={t("trax.table.es_prestamo")} placement="top">
                        <><span className={`me-1 bp5-icon bp5-icon-bank-account text-primary`} /></>
                    </Tooltip>
                    : null}
                {` ${appContext.formatCurrency(row.monto)}`}
            </>
        },
        {
            name: t("trax.table.cuenta_1"),
            name_search: t("trax.table.cuenta"),
            value: "cuenta",
            text: row => row.cuenta_1
        },
        {
            name: t("trax.table.tipo_trax"),
            csvText: row => t("general.trax_type." + row.tipo_trax),
        },
        {
            name: t("trax.table.nombre"),
            value: "nombre",
            omit: true,
        },
        {
            name: t("trax.table.proyecto"),
            value: "proyecto",
            omit: true,
        },
    ];

    const FORM = (i) => [
        {
            title: t('trax.form.section_1'),
            inputs: [
                [
                    { id: "id_cuenta_1", required: true, defaultValue: i?.id_cuenta_1, defaultText: i?.cuenta_1, title: t('trax.form.id_cuenta_1'), placeholder: t('trax.form.id_cuenta_1'), icon: "bank-account", type: 'list', api: getPairCuentas, apiExt: { origin: 1 }, },
                    { id: "monto", required: true, defaultValue: i?.monto, title: t('trax.form.monto'), placeholder: t('trax.form.monto'), icon: "dollar", type: 'number', format: appContext.formatCurrency, },
                    { id: "tipo_pago", required: true, defaultValue: i?.tipo_pago, title: t('trax.form.tipo_pago'), placeholder: t('trax.form.tipo_pago'), icon: "dollar", type: 'select', list: Vars.payment_type.map(i => ({ value: i, text: t(`general.payment_type.${i}`) })), hide: true },
                    { id: "descripcion", defaultValue: i?.descripcion, title: t('trax.form.descripcion'), placeholder: t('trax.form.descripcion'), icon: "font", },
                    { id: "fecha", required: true, defaultValue: i?.fecha, title: t('trax.form.fecha'), placeholder: t('trax.form.fecha'), type: 'date', },
                ],
                [

                    { id: "tipo_trax", required: true, defaultValue: i?.tipo_trax, title: t('trax.form.tipo_trax'), placeholder: t('trax.form.tipo_trax'), icon: "tag", type: 'select', list: Vars.trax_type.map(i => ({ value: i, text: t(`general.trax_type.${i}`) })) },
                    { id: "relation", required: true, defaultValue: i ? getRelation(i) : traxRelation, title: t('trax.form.relacion_trax'), placeholder: t('trax.form.relacion_trax'), icon: "tag", type: 'select', list: Vars.trax_relations.map(i => ({ value: i, text: t(`trax.form.relation.${i}`) })), onChange: (e) => { selecTraxRelation(e.target.value); selecTraxRelationEdit(null) } },

                    { id: "id_proyecto", required: true, defaultValue: i?.id_proyecto, defaultText: i?.proyecto, title: t('trax.form.id_proyecto'), placeholder: t('trax.form.id_proyecto'), icon: "projects", type: 'list', api: getPairProyectos, hide: getRelation(i) !== "pro" && getRelation(i) !== "doble", },
                    { id: "id_cuenta_2", required: true, defaultValue: i?.id_cuenta_2, defaultText: i?.cuenta_2, title: t('trax.form.id_cuenta_2'), placeholder: t('trax.form.id_cuenta_2'), icon: "bank-account", type: 'list', api: getPairCuentas, apiExt: { origin: null }, hide: getRelation(i) !== "trax", },
                    { id: "id_persona", required: true, defaultValue: i?.id_persona, defaultText: i?.persona, title: t('trax.form.id_persona'), placeholder: t('trax.form.id_persona'), icon: "person", type: 'list', api: getPairPersonas, hide: getRelation(i) !== "persona" && getRelation(i) !== "doble", },
                    { id: "es_prestamo", required: true, defaultValue: i?.es_prestamo, title: t('trax.form.es_prestamo'), placeholder: t('trax.form.es_prestamo'), icon: "bank-account", type: 'select', list: Vars.boolean.map(i => ({ value: i, text: t(`general.boolean.${i}`) })), hide: getRelation(i) !== "persona", },
                ],
            ]
        },
    ]


    const MODAL = (i) => <Dialog
        title={i ? t('trax.form.edit').replace('%VAR%', `${i.id} - ${i.descripcion}`) : t('trax.form.new')}
        icon={i ? "edit" : "add"}
        isOpen={modal} onClose={() => setModal(false)}
        className='modal-app'>
        <DialogBody useOverflowScrollContainer={true} >
            <FormComponent
                actions={{
                    primary: { icon: i ? "edit" : "add", text: i ? t('actions.edit') : t('actions.new') },
                    secondary: { icon: "cross", text: t('actions.close') }
                }}
                onSecondary={() => setModal(false)}
                onSubmit={(data) => i ? edit(i.id, data) : create(data)}
                groups={FORM(i)}
            />
        </DialogBody>
    </Dialog>

    const ALERT = () => <Alert
        cancelButtonText={t('actions.cancel')}
        confirmButtonText={t('actions.delete')}
        canEscapeKeyCancel={true}
        canOutsideClickCancel={true}
        icon={'trash'}
        intent={'danger'}
        isOpen={alert}
        loading={isLoading}
        onCancel={() => {
            setItem(null);
            setAlert(false);
        }}
        onConfirm={() => {
            setAlert(false);
            remove(item?.id);
        }}
    >
        <p>{t('actions.bodyDelete').replace('%VAR%', item?.descripcion || '')}</p>

    </Alert>

    return (
        <div>
            <hr />
            {ALERT()}
            {MODAL(item)}
            <TableApp
                data={data}
                columns={columns}
                loading={isLoading}
                title={t('trax.table.title')}
                id="trax"
                search
                btn={authContext.verify(location, "POST") ? <Button icon="add" text={t('actions.new')} intent="primary" onClick={() => {
                    setItem(null);
                    setModal(true);
                }} /> : null}
                reload={list}
                reloadPag
                csv
                csvName={t("trax.table.csv")}
                csvApi={list_csv}
            />

        </div>
    );
}