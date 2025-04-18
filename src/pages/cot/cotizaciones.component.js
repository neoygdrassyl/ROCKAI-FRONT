import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { Alert, Button, ButtonGroup, Dialog, DialogBody, Tooltip } from '@blueprintjs/core';
import { AuthContext } from "../../utils/context/auth.context.ts";
import { AppContext } from "../../utils/context/app.context.js";
import cotizacionesService from "../../services/cotizaciones.service.js";
import proyectosService from "../../services/proyectos.service.js";
import TableApp from "../../utils/components/table.component.js";
import FormComponent from "../../utils/components/form.component.js";
import Servicios_Builder from "./serviciosBuilder.component.js";
import serviciosService from "../../services/servicios.service.js";


export default function Cotizacion() {
    const [data, setData] = useState([])
    const [item, setItem] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [isLoadingServices, setLoadingServices] = useState(false)
    const [alert, setAlert] = useState(false)
    const [modal, setModal] = useState(false)
    const [modaP, setModalP] = useState(false)
    const authContext = useContext(AuthContext)
    const appContext = useContext(AppContext)
    const location = useLocation()
    const { t } = useTranslation();
    const toastInfo = (msg) => toast.info(msg, { autoClose: 1500, theme: "light", });

    function list(page = 1, pageSize = 20, field = null, value = null, aprobado = null) {
        if (authContext.verify(location, "GET")) {
            setLoading(true);
            if (field && value) cotizacionesService.search(page, pageSize, field, value, aprobado)
                .then(res => {
                    setData(res.data);
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    setLoading(false);
                })
            else cotizacionesService.list(page, pageSize, aprobado)
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
            cotizacionesService.get(i.id)
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
            cotizacionesService.create(form)
                .then(res => {
                    if (res.data) {
                        toast.dismiss();
                        toast.success(t('actions.creaated'));
                    }
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    list();
                })
        } else {
            toast.warning(t('auth.nopermit'));
        }

    }

    function create_proyect(form) {
        if (authContext.verify({ pathname: '/pro' }, "POST")) {
            setModalP(false);
            toastInfo(t('actions.procesing'));
            proyectosService.create(form)
                .then(res => {
                    if (res.data) {
                        toast.dismiss();
                        toast.success(t('actions.creaated'));
                    }
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    list();
                })
        } else {
            toast.warning(t('auth.nopermit'));
        }

    }

    function edit(id, form) {
        if (authContext.verify(location, "PUT")) {
            setModal(false);
            toastInfo(t('actions.procesing'))
            cotizacionesService.update(form, id)
                .then(res => {
                    if (res.data) {
                        toast.dismiss();
                        toast.success(t('actions.edited'));
                    }
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    list();
                })
        } else {
            toast.warning(t('auth.nopermit'))
        }

    }

    function remove(id) {
        if (authContext.verify(location, "DELETE")) {
            setModal(false);
            toastInfo(t('actions.procesing'))
            cotizacionesService.delete(id)
                .then(res => {
                    if (res.data) {
                        toast.dismiss();
                        toast.success(t('actions.deleted'));
                    }
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    list();
                })
        } else {
            toast.warning(t('auth.nopermit'))
        }

    }

    function remove_service(id) {
        if (authContext.verify(location, "DELETE")) {
            toastInfo(t('actions.procesing'))
            return serviciosService.delete(id)
                .then(res => {
                    if (res.data) {
                        toast.dismiss();
                        toast.success(t('actions.deleted'));
                        get(item);
                    }
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => true)
        } else {
            toast.warning(t('auth.nopermit'))
        }

    }

    async function getPair(search) {
        if (authContext.verify(location, "GET")) {
            return cotizacionesService.getPersonas(search)
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

    const codRegex = /^COT\.\d\d\d\.\d\d\d\d$/i;
    const codRegexPro = /^\d\d\d\.\d\d\d\d$/i;

    useEffect(() => {
        list();
    }, []);

    const columns = [
        {
            name: t("cotizacion.table.codigo"),
            value: "codigo",
            text: row => row.codigo,
            component: row => <>
                <Tooltip content={row.aprobado ? t("cotizacion.table.approved") : t("cotizacion.table.notapproved")} placement="top">
                    <><span className={`bp5-icon bp5-icon-${row.aprobado ? 'thumbs-up' : 'remove'} text-${row.aprobado ? 'success' : 'danger'}`} /></>
                </Tooltip>
                {` ${row.codigo}`}
            </>
        },
        {
            name: t("cotizacion.table.descripcion"),
            value: "descripcion",
            text: row => row.descripcion,
        },
        {
            name: t("cotizacion.table.nombre"),
            value: "nombre",
            text: row => row.nombre,
        },
        {
            name: t("cotizacion.table.fecha"),
            value: "fecha",
            text: row => row.fecha,
        },
        {
            name: t("cotizacion.table.monto"),
            component: row => appContext.cotMontoBase(row)
        },
        {
            name: t("cotizacion.table.iva"),
            component: row => appContext.cotMontoIva(row, true)
        },
        {
            name: t("cotizacion.table.monto_2"),
            component: row => appContext.cotMontoTotal(row)
        },
        {
            name: t("cotizacion.table.action"),
            width: '120px',
            component: row => <>
                <ButtonGroup>
                    {authContext.verify(location, "PUT") ? <>
                        {row.aprobado === 0
                            ? <Tooltip content={t('cotizacion.table.approve')} placement="top">
                                <Button icon="thumbs-up" intent='primary' onClick={() => {
                                    setItem(row);
                                    setModalP(true);
                                }} />
                            </Tooltip>
                            : null
                        }
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
            title: t('cotizacion.form.section_1'),
            inputs: [
                [
                    { id: "codigo", required: true, defaultValue: i?.codigo, title: t('cotizacion.form.codigo'), placeholder: t('cotizacion.form.codigo'), icon: "tag", pattern: codRegex, validateText: t('cotizacion.form.codigo_validate') },
                    { id: "descripcion", defaultValue: i?.descripcion, title: t('cotizacion.form.descripcion'), placeholder: t('cotizacion.form.descripcion'), icon: "tag", },
                    { id: "fecha", required: true, defaultValue: i?.fecha, title: t('cotizacion.form.fecha'), placeholder: t('cotizacion.form.fecha'), type: "date", },
                    { id: "id_persona", required: true, defaultValue: i?.id_persona, defaultText: i?.nombre, title: t('cotizacion.form.id_persona'), placeholder: t('cotizacion.form.id_persona'), icon: "person", type: 'list', api: getPair },
                ],
                [
                    { id: "monto", required: true, defaultValue: i?.monto, title: t('cotizacion.form.monto'), placeholder: t('cotizacion.form.monto'), icon: "dollar", type: 'number', format: appContext.formatCurrency, },
                    { id: "iva", defaultValue: i?.iva, title: t('cotizacion.form.iva'), placeholder: t('cotizacion.form.iva'), icon: "percentage", type: 'percent', },
                    { id: "adm", defaultValue: i?.adm, title: t('cotizacion.form.adm'), placeholder: t('cotizacion.form.adm'), icon: "percentage", type: 'percent', },
                    { id: "imp", defaultValue: i?.imp, title: t('cotizacion.form.imp'), placeholder: t('cotizacion.form.imp'), icon: "percentage", type: 'percent', },
                    { id: "uti", defaultValue: i?.uti, title: t('cotizacion.form.uti'), placeholder: t('cotizacion.form.uti'), icon: "percentage", type: 'percent', },
                ],
            ]
        },
        {
            title: t('cotizacion.form.section_2'),
            multiple: true,
            hide: i ? false : true,
            defaultValues: i?.services,
            name: 'services',
            deleteApi: remove_service,
            deleteAllow: authContext.verify(location, "DELETE"),
            inputs: [
                [
                    { component: <Servicios_Builder />, index: 'nombre', id: "nombre", },
                    { id: "monto", index: 'monto', title: t('servicios.form.monto'), placeholder: t('servicios.form.monto'), icon: "dollar", type: 'number', format: appContext.formatCurrency, },
                    { id: "id_tercero", index: 'id_tercero',  text: 'persona', title: t('servicios.form.tercero'), placeholder: t('servicios.form.tercero'), icon: "person", type: 'list', api: getPair },
                ],
            ]
        },
    ]

    const FORM_PROYECT = (i) => [
        {
            title: t('pro.form.section_1'),
            inputs: [
                [
                    { id: "codigo", required: true, title: t('pro.form.codigo'), placeholder: t('pro.form.codigo'), icon: "tag", pattern: codRegexPro, validateText: t('pro.form.codigo_validate') },
                    { id: "nombre", required: true, defaultValue: i?.descripcion, title: t('pro.form.nombre'), placeholder: t('pro.form.nombre'), icon: "tag", },
                    { id: "id_cotizacion", defaultValue: i?.id, type: 'hidden' },
                    { id: "propietario", defaultValue: i?.propietario, title: t('pro.form.propietario'), placeholder: t('pro.form.propietario'), icon: "person" },
                    { id: "curaduria", defaultValue: i?.curaduria, title: t('pro.form.curaduria'), placeholder: t('pro.form.curaduria'), icon: "tag" },
                ],
                [
                    { id: "municipio", title: t('pro.form.municipio'), placeholder: t('pro.form.municipio'), icon: "map-marker", type: "list", list: appContext.getCityList() },
                    { id: "direccion", title: t('pro.form.direccion'), placeholder: t('pro.form.direccion'), icon: "home", },
                    { id: "fecha_inicio", title: t('pro.form.fecha_inicio'), placeholder: t('pro.form.fecha_inicio'), type: "date" },
                    { id: "fecha_entrega", title: t('pro.form.fecha_entrega'), placeholder: t('pro.form.fecha_entrega'), type: "date" },
                ],
            ]
        },
    ]

    const MODAL = (i) => <Dialog
        title={i ? t('cotizacion.form.edit').replace('%VAR%', i.descripcion) : t('cotizacion.form.new')}
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

    const MODA_PROYECTL = (i) => <Dialog
        title={t('pro.form.new')}
        icon={"add"}
        isOpen={modaP} onClose={() => setModalP(false)}
        className='modal-app'>
        <DialogBody useOverflowScrollContainer={true} >
            <FormComponent
                actions={{
                    primary: { icon: "add", text: t('actions.new') },
                    secondary: { icon: "cross", text: t('actions.close') }
                }}
                onSecondary={() => setModalP(false)}
                onSubmit={(data) => create_proyect(data)}
                groups={FORM_PROYECT(i)}
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
        <p>{t('actions.bodyDelete').replace('%VAR%', item?.descripcion)}</p>

    </Alert>
    return (
        <div>
            <hr />
            <ToastContainer theme="colored" />
            {ALERT()}
            {MODAL(item)}
            {MODA_PROYECTL(item)}
            <TableApp
                data={data}
                columns={columns}
                loading={isLoading}
                title={null}
                id="cotizacion"
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