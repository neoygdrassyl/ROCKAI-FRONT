import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { Alert, Button, ButtonGroup, Dialog, DialogBody, Tooltip } from '@blueprintjs/core';
import { AuthContext } from "../../utils/context/auth.context.ts";
import { AppContext } from "../../utils/context/app.context.js";
import cuentasService from "../../services/cuentas.service.js";
import TableApp from "../../utils/components/table.component.js";
import FormComponent from "../../utils/components/form.component.js";
import Vars from "../../utils/json/variables.json"

export default function Cuentas(props) {
    const { refresh, serRefresh } = props
    const [data, setData] = useState([])
    const [item, setItem] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [alert, setAlert] = useState(false)
    const [modal, setModal] = useState(false)
    const authContext = useContext(AuthContext)
    const appContext = useContext(AppContext)
    const location = useLocation()
    const { t } = useTranslation();
    const toastInfo = (msg) => toast.info(msg, { autoClose: 1500, theme: "light", });

    function list(page = 1, pageSize = 20, field = null, value = null, es_propia = null) {
        if (authContext.verify(location, "GET")) {
            setLoading(true);
            if (field && value) cuentasService.search(page, pageSize, field, value, es_propia)
                .then(res => {
                    setData(res.data);
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    setLoading(false);
                })
            else cuentasService.list(page, pageSize, es_propia)
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
            cuentasService.get(i.id)
                .then(res => {
                    setItem(res.data);
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
            cuentasService.create(form)
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
            cuentasService.update(form, id)
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
            cuentasService.delete(id)
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

    async function getPair(search) {
        if (authContext.verify(location, "GET")) {
            return cuentasService.getPersonas(search)
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

    useEffect(() => {
        list();
    }, []);

    useEffect(() => {
        list()
    }, [refresh]);


    const columns = [
        {
            name: t("cuentas.table.descripcion"),
            value: "descripcion",
            text: row => row.descripcion,
            component: row => <>
                <Tooltip content={row.es_propia ? t("cuentas.table.is_owned") : t("cuentas.table.not_owned")} placement="top">
                    <><span className={`bp5-icon bp5-icon-${row.es_propia ? 'input' : 'output'} text-${row.es_propia ? 'success' : 'danger'}`} /></>
                </Tooltip>
                {` ${row.descripcion || ''}`}
            </>
        },
        {
            name: t("cuentas.table.nombre"),
            value: "nombre",
            text: row => row.nombre
        },
        {
            name: t("cuentas.table.nr_cuenta"),
            value: "nr_cuenta",
            text: row => row.nr_cuenta,
            component: row => <>
                <Tooltip content={t("general.bank_account_type." + row.tipo)} placement="top">
                    <span className={`fw-bold`} >{t('general.bank_account_type_synbol.' + row.tipo)}</span>
                </Tooltip>
                {` ${row.nr_cuenta}`}
            </>
        },
        {
            name: t("cuentas.table.banco"),
            text: row => row.banco
        },
        {
            name: t("actions.action"),
            width: '120px',
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
    ];

    const FORM = (i) => [
        {
            title: t('cuentas.form.section_1'),
            inputs: [
                [
                    { id: "tipo", required: true, defaultValue: i?.tipo, title: t('cuentas.form.tipo'), placeholder: t('cuentas.form.tipo'), icon: "tag", type: "select", list: Vars.bank_account_type.map(i => ({ value: i, text: t(`general.bank_account_type.${i}`) })) },
                    { id: "nr_cuenta", required: true, defaultValue: i?.nr_cuenta, title: t('cuentas.form.nr_cuenta'), placeholder: t('cuentas.form.nr_cuenta'), icon: "grid", },
                    { id: "descripcion", required: true, defaultValue: i?.descripcion, title: t('cuentas.form.descripcion'), placeholder: t('cuentas.form.descripcion'), icon: "font", },
                    { id: "banco", defaultValue: i?.banco, title: t('cuentas.form.banco'), placeholder: t('cuentas.form.banco'), icon: "bank-account", type: 'list', list: appContext.getBanksList() },
                ],
                [
                    { id: "id_persona", required: true, defaultValue: i?.id_persona, defaultText: i?.nombre, title: t('cuentas.form.id_persona'), placeholder: t('cuentas.form.id_persona'), icon: "person", type: 'list', api: getPair },
                    { id: "es_propia", required: true, defaultValue: i?.es_propia, title: t('cuentas.form.es_propia'), placeholder: t('cuentas.form.es_propia'), icon: "tick", type: "select", list: [{ value: 0, text: t('cuentas.form.no') }, { value: 1, text: t('cuentas.form.yes') }] },
                ],
            ]
        },
    ]


    const MODAL = (i) => <Dialog
        title={i ? t('cuentas.form.edit').replace('%VAR%', i.descripcion) : t('cuentas.form.new')}
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
                title={t('cuentas.table.title')}
                id="cuentas"
                search
                btn={authContext.verify(location, "POST") ? <Button icon="add" text={t('actions.new')} intent="primary" onClick={() => {
                    setItem(null);
                    setModal(true);
                }} /> : null}
                reload={list}
                reloadPag
            />

        </div>
    );
}