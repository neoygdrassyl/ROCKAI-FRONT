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
import serviciosService from "../../services/servicios.service.js";
import Vars from "../../utils/json/variables.json"
import personasService from "../../services/personas.service.js";
import TerceroShowMore from "../hr/personaShow.component.js";

export default function Cotizacion() {
    const [data, setData] = useState([])
    const [item, setItem] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [personType, setPersonType] = useState('N')
    const [alert, setAlert] = useState(false)
    const [modal, setModal] = useState(false)
    const [modaP, setModalP] = useState(false)
    const [modalt, setModalt] = useState(false)
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

    async function get(i, set) {
        if (authContext.verify(location, "GET")) {
            await cotizacionesService.get(i.id)
                .then(res => {
                    setItem(res.data);
                    if (set) {
                        set(true);
                    }
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {

                })
        } else {
            toast.warning(t('auth.nopermit'))
        }

    }

    async function getLastId() {
        if (authContext.verify(location, "GET")) {
            await cotizacionesService.getLastID()
                .then(res => {
                    document.getElementById('codigo').value = res.data[0].codigo
                })
                .catch(error => console.error(error))

        }
    }

    async function getLastIdPro() {
        if (authContext.verify({ pathname: "/pro" }, "GET")) {
            await proyectosService.getLastID()
                .then(res => {
                    document.getElementById('codigo').value = res.data[0].codigo
                })
                .catch(error => console.error(error))

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

    function create_tercero(form) {
        if (authContext.verify(location, "POST")) {
            setModalt(false);
            toastInfo(t('actions.procesing'));
            personasService.create(form)
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

    async function remove_service(id, form) {
        let remaining_services = item.services.filter(i => i.id !== id);
        let sum = 0;
        for (let i = 0; i < remaining_services.length; i++) {
            const service = remaining_services[i]
            const monto = Number(service.monto);
            const cantidad = Number(service.cantidad);
            let monto_base = (monto * cantidad)

            sum += monto_base
        }
        let new_form = { ...form }
        new_form.monto = sum;
        new_form.services = null;
        await cotizacionesService.update(new_form, item.id);

        if (authContext.verify(location, "DELETE")) {
            toastInfo(t('actions.procesing'))
            return serviciosService.delete(id)
                .then(res => {
                    if (res.data) {
                        toast.dismiss();
                        toast.success(t('actions.deleted'));
                        get(item);
                        list();
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

    function calculate_montos() {
        let sum = 0;
        const montos = document.getElementsByName('monto_servicio');
        const montos_finales = document.getElementsByName('monto_total');
        const cants = document.getElementsByName('cantidad');
        for (let i = 0; i < montos.length; i++) {
            const monto = montos[i].value.replace(/\D/g, '');
            const cantidad = cants[i].value;
            let monto_final = (monto * cantidad)
            sum += monto_final
            montos_finales[i].value = appContext.formatCurrency(monto_final)
        }
        sum = appContext.formatCurrency(sum)
        document.getElementById('monto').value = sum
    }

    function defaultValue_monto(...data) {
        const i = data[1];
        const groups = data[2];
        const servicios = groups[1];
        if (!servicios) return '';
        if (!servicios.defaultValues[i]) return '';
        const input_data = servicios.defaultValues[i];
        const monto = input_data.monto;
        const cantidad = input_data.cantidad;
        const defaultValue = appContext.formatCurrency(monto * cantidad);
        return defaultValue;
    }

    function defaultValue_monto_base(...data) {
        const groups = data[2];
        const servicios = groups[1];
        if (!servicios) return false
        if (!servicios.defaultValues) return false;
        const input_data = servicios.defaultValues;
        let sum = 0;
        for (let i = 0; i < input_data.length; i++) {
            const monto = input_data[i].monto;
            const cantidad = input_data[i].cantidad;
            let monto_base = (monto * cantidad)
            sum += monto_base
        }
        return sum;
    }

    function onChangePersonType(e) {
        setPersonType(e.target.value)
    }

    const addTerceroBtn = authContext.verify({ pathname: "/hr" }, "POST") ? <Tooltip className="right-element" content={t('actions.new')} placement="top">
        <Button icon="add" intent='primary' onClick={() => setModalt(true)} />
    </Tooltip>
        : null;

    const codRegex = /^COT\.\d\d\d\.\d\d\d\d$/i;
    const codRegexPro = /^\d\d\d\.\d\d\d\d$/i;
    const cantFormat = (x) => Math.abs(Number(x).toFixed(0));

    useEffect(() => {
        list();
    }, []);


    useEffect(() => {
        if (modaP) getLastIdPro();
    }, [modaP]);

    const columns = [
        {
            name: t("cotizacion.table.action"),
            width: '120px',
            component: row => <>
                <ButtonGroup>
                    {authContext.verify(location, "PUT") ? <>
                        {row.aprobado === 0
                            ? <Tooltip content={t('cotizacion.table.approve')} placement="top">
                                <Button icon="thumbs-up" intent='primary' onClick={async () => {
                                    await get(row, setModalP);
                                }} />
                            </Tooltip>
                            : null
                        }
                        <Tooltip content={t('actions.edit')} placement="top">
                            <Button icon="edit" intent='warning' onClick={() => get(row, setModal)} />
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
            component: row => row.id_tercero ?
                <TerceroShowMore id={row.id_tercero} text={row.nombre} /> : row.nombre
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

    ];

    const FORM = (i) => [
        {
            title: t('cotizacion.form.section_1'),
            inputs: [
                [
                    { id: "codigo", required: true, defaultValue: i?.codigo, title: t('cotizacion.form.codigo'), placeholder: t('cotizacion.form.codigo'), icon: "tag", pattern: codRegex, validateText: t('cotizacion.form.codigo_validate'), },
                    { id: "descripcion", defaultValue: i?.descripcion, title: t('cotizacion.form.descripcion'), placeholder: t('cotizacion.form.descripcion'), icon: "tag", },
                    { id: "fecha", required: true, defaultValue: i?.fecha, title: t('cotizacion.form.fecha'), placeholder: t('cotizacion.form.fecha'), type: "date", },
                    { id: "id_persona", required: true, defaultValue: i?.id_persona, defaultText: i?.nombre, title: t('cotizacion.form.id_persona'), placeholder: t('cotizacion.form.id_persona'), icon: "person", type: 'list', api: getPair, right: i ? null : addTerceroBtn },
                ],
                [
                    { id: "intro", defaultValue: i?.intro || t('cotizacion.form.intro_dv'), title: t('cotizacion.form.intro'), placeholder: t('cotizacion.form.intro'), type: "textarea" },
                ],
                [
                    { id: "alcance", defaultValue: i?.alcance, title: t('cotizacion.form.alcance'), placeholder: t('cotizacion.form.alcance'), type: "textarea" },
                ],
                [
                    { id: "requerimientos", defaultValue: i?.requerimientos, title: t('cotizacion.form.requerimientos'), placeholder: t('cotizacion.form.requerimientos'), type: "textarea" },
                ],
                [
                    { id: "entregables", defaultValue: i?.entregables, title: t('cotizacion.form.entregables'), placeholder: t('cotizacion.form.entregables'), type: "textarea" },
                ],
                [
                    { id: "tiempo", defaultValue: i?.tiempo, title: t('cotizacion.form.tiempo'), placeholder: t('cotizacion.form.tiempo'), type: "textarea" },
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
                    // { component: <Servicios_Builder />, index: 'nombre', id: "nombre", },
                    { id: "nombre", index: 'nombre', title: t('servicios.form.nombre'), placeholder: t('servicios.form.nombre'), icon: "label", },
                    { id: "medida", index: 'medida', title: t('servicios.form.medida'), placeholder: t('servicios.form.medida'), icon: "cube", type: 'select', list: Vars.servicios_medidas.map(i => ({ value: i, text: t(`general.servicios_medidas.${i}`) })) },
                    { id: "cantidad", name: 'cantidad', index: 'cantidad', title: t('servicios.form.cantidad'), placeholder: t('servicios.form.cantidad'), icon: "cross", type: 'number', format: cantFormat, defaultValue: Number(1), onBlur: calculate_montos },
                    { id: "monto", name: 'monto_servicio', index: 'monto', title: t('servicios.form.monto'), placeholder: t('servicios.form.monto'), icon: "dollar", type: 'number', format: appContext.formatCurrency, onBlur: calculate_montos },
                    { id: "monto_total", name: 'monto_total', index: 'monto_total', title: t('servicios.form.monto_total'), placeholder: t('servicios.form.monto_total'), icon: "dollar", read: true, defaultValue: defaultValue_monto },
                    { id: "id_tercero", index: 'id_tercero', text: 'persona', title: t('servicios.form.tercero'), placeholder: t('servicios.form.tercero'), icon: "person", type: 'list', api: getPair, hide: i?.aprobado == false },
                    { id: "monto_tercero", index: 'monto_tercero', title: t('servicios.form.monto_tercero'), placeholder: t('servicios.form.monto_tercero'), icon: "dollar", type: 'number', format: appContext.formatCurrency, hide: i?.aprobado == false },
                ],
            ]
        },
        {
            title: "",
            hide: i ? false : true,
            inputs: [
                [
                    { id: "monto", defaultValue: defaultValue_monto_base || i?.monto, title: t('cotizacion.form.monto'), placeholder: t('cotizacion.form.monto'), icon: "dollar", type: 'number', format: appContext.formatCurrency, hide: i ? false : true, read: true, },
                    { id: "iva", defaultValue: i?.iva, title: t('cotizacion.form.iva'), placeholder: t('cotizacion.form.iva'), icon: "percentage", type: 'percent', hide: i ? false : true, },
                    { id: "adm", defaultValue: i?.adm, title: t('cotizacion.form.adm'), placeholder: t('cotizacion.form.adm'), icon: "percentage", type: 'percent', hide: i ? false : true, },
                    { id: "imp", defaultValue: i?.imp, title: t('cotizacion.form.imp'), placeholder: t('cotizacion.form.imp'), icon: "percentage", type: 'percent', hide: i ? false : true, },
                    { id: "uti", defaultValue: i?.uti, title: t('cotizacion.form.uti'), placeholder: t('cotizacion.form.uti'), icon: "percentage", type: 'percent', hide: i ? false : true, },
                ],
            ]
        },
        {
            title: "",
            inputs: [
                [
                    { id: "pago", defaultValue: i?.pago, title: t('cotizacion.form.pago'), placeholder: t('cotizacion.form.pago'), type: "textarea" },
                ],
                [
                    { id: "validez", defaultValue: i?.validez || t('cotizacion.form.validez_dv'), title: t('cotizacion.form.validez'), placeholder: t('cotizacion.form.validez'), type: "textarea" },
                ],
                [
                    { id: "observaciones", defaultValue: i?.observaciones, title: t('cotizacion.form.observaciones'), placeholder: t('cotizacion.form.observaciones'), type: "textarea" },
                ],
            ]
        }
    ]

    const FORM_PROYECTO = (i) => [
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
                [
                    { id: "observaciones", defaultValue: i?.observaciones, title: t('pro.form.observaciones'), placeholder: t('pro.form.observaciones'), type: "textarea" },
                ],
            ]
        },
        {
            title: t('cotizacion.form.section_2'),
            multiple: true,
            fixed: true,
            defaultValues: i?.services,
            name: 'services',
            inputs: [
                [
                    { id: "nombre", index: 'nombre', title: t('servicios.form.nombre'), placeholder: t('servicios.form.nombre'), icon: "label", read: true, },
                    { id: "medida", index: 'medida', title: t('servicios.form.medida'), placeholder: t('servicios.form.medida'), icon: "cube", read: true, type: 'select', list: Vars.servicios_medidas.map(i => ({ value: i, text: t(`general.servicios_medidas.${i}`) })) },
                    { id: "cantidad", index: 'cantidad', title: t('servicios.form.cantidad'), placeholder: t('servicios.form.cantidad'), icon: "cross", type: 'number', format: cantFormat, read: true, },
                    { id: "monto", index: 'monto', title: t('servicios.form.monto'), placeholder: t('servicios.form.monto'), icon: "dollar", type: 'number', format: appContext.formatCurrency, read: true, },
                    { id: "id_tercero", index: 'id_tercero', text: 'persona', title: t('servicios.form.tercero'), placeholder: t('servicios.form.tercero'), icon: "person", type: 'list', api: getPair },
                    { id: "monto_tercero", index: 'monto_tercero', title: t('servicios.form.monto_tercero'), placeholder: t('servicios.form.monto_tercero'), icon: "dollar", type: 'number', format: appContext.formatCurrency, },
                ],
            ]
        },
    ]

    const FORM_TERCERO = () => [
        {
            title: t('personas.form.section_1'),
            inputs: [
                [
                    { id: "tipo", title: t('personas.form.tipo'), placeholder: t('personas.form.tipo'), icon: "tag", type: "select", list: [{ value: 'N', text: t('personas.form.N') }, { value: 'J', text: t('personas.form.J') }], onChange: onChangePersonType },
                    { id: "name", required: true, title: t('personas.form.nombre'), placeholder: t('personas.form.nombre'), icon: "person", },
                    { id: "cedula_nit", required: true, title: t('personas.form.cedula_nit'), placeholder: t('personas.form.cedula_nit'), icon: "id-number", format: personType === 'N' ? appContext.formatId : appContext.formatNit },
                    { id: "ciudad", title: t('personas.form.ciudad'), placeholder: t('personas.form.ciudad'), icon: "home", type: "list", list: appContext.getCityList() },
                    { id: "direccion", title: t('personas.form.direccion'), placeholder: t('personas.form.direccion'), icon: "home", },
                ],
                [
                    { id: "telefono", title: t('personas.form.telefono'), placeholder: t('personas.form.telefono'), icon: "phone", format: appContext.formatPhone },
                    { id: "correo", title: t('personas.form.correo'), placeholder: t('personas.form.correo'), icon: "at", pattern: appContext.emailPattern },
                    { id: "rut", title: t('personas.form.rut'), placeholder: t('personas.form.rut'), icon: "folder-open", disabled: true, },
                    { id: "cv", title: t('personas.form.cv'), placeholder: t('personas.form.cv'), icon: "folder-open", disabled: true, },
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

    const MODAL_PROYECTO = (i) => <Dialog
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
                groups={FORM_PROYECTO(i)}
            />
        </DialogBody>
    </Dialog>

    const MODAL_TERCERO = () => <Dialog
        title={t('personas.form.new')}
        icon={"add"}
        isOpen={modalt} onClose={() => setModalt(false)}
        className='modal-app'>
        <DialogBody useOverflowScrollContainer={true} >
            <FormComponent
                actions={{
                    primary: { icon: "add", text: t('actions.new') },
                    secondary: { icon: "cross", text: t('actions.close') }
                }}
                onSecondary={() => setModalt(false)}
                onSubmit={(data) => create_tercero(data)}
                groups={FORM_TERCERO()}
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
            {MODAL_PROYECTO(item)}
            {MODAL_TERCERO(item)}
            <TableApp
                data={data}
                columns={columns}
                loading={isLoading}
                title={null}
                id="cotizacion"
                search
                btn={authContext.verify(location, "POST") ? <Button icon="add" text={t('actions.new')} intent="primary" onClick={async () => {
                    setItem(null);
                    setModal(true);
                    await getLastId();
                }} /> : null}
                reload={list}
                reloadPag
            />
        </div>
    );
}