import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { Alert, Button, ButtonGroup, Dialog, DialogBody, Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import proyectosService from '../../services/proyectos.service.js';
import facturasService from '../../services/facturas.service.js';
import proveedoresService from '../../services/proveedores.service.js';
import TableApp from '../../utils/components/table.component.js';
import { AuthContext } from '../../utils/context/auth.context.ts';
import FormComponent from '../../utils/components/form.component.js';
import { AppContext } from '../../utils/context/app.context.js';
import ProyectoShowMore from './proyectoShow.component.js';
import Facturas from './facturas.component.js';
import Vars from "../../utils/json/variables.json"
import ProyectoEntregables from './emtregables.component.js';
import TerceroShowMore from '../hr/personaShow.component.js';

export default function Proyectos(props) {
    const [data, setData] = useState([])
    const [item, setItem] = useState(null)
    const [itemf, setItemf] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [alert, setAlert] = useState(false)
    const [modal, setModal] = useState(false)
    const [canCreate] = useState(false)
    const authContext = useContext(AuthContext)
    const appContext = useContext(AppContext)
    const location = useLocation()
    const { t } = useTranslation();
    const toastInfo = (msg) => toast.info(msg, { autoClose: 1500, theme: "light", });

    function list(page = 1, pageSize = 20, field, value) {
        if (authContext.verify(location, "GET")) {
            setLoading(true);
            if (field && value) proyectosService.search(page, pageSize, field, value)
                .then(res => {
                    setData(res.data);
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    setLoading(false);
                })
            else proyectosService.list(page, pageSize)
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

    async function get(i) {
        if (authContext.verify(location, "GET")) {
            await proyectosService.get(i.id)
                .then(res => {
                    setItem(res.data);
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {

                })
        } else {
            toast.warning(t('auth.nopermit'))
        }
        if (authContext.verify({ pathname: "/cot" }, "GET")) {
            if (i.id_factura) facturasService.get(i.id_factura)
                .then(res => {
                    setItemf(res.data);
                    setModal(true);
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => { })
            else setModal(true);
        } else {
            toast.warning(t('auth.nopermit'))
        }
    }

    function create(form) {
        if (authContext.verify(location, "POST")) {
            setModal(false);
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

    function manage_proyecto(form, id_proyecto, id_factura) {

        if (authContext.verify(location, "PUT")) {
            setModal(false);
            toastInfo(t('actions.procesing'))
            proyectosService.update(form, id_proyecto)
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

        if (authContext.verify(location, "PUT")) {
            const form_factura = {
                descripcion: form.fac_descripcion,
                fecha: form.fac_fecha,
                estado: form.fac_estado,
                id_proyecto: id_proyecto,
            };
            if (id_factura) {
                facturasService.update(form_factura, id_factura)
                    .catch(error => appContext.errorHandler(error, toast, t))
                    .finally(() => { })
            }
            else {
                facturasService.create(form_factura)
                    .catch(error => appContext.errorHandler(error, toast, t))
                    .finally(() => { })
            }
        }

    }

    function remove(id) {
        if (authContext.verify(location, "DELETE")) {
            setModal(false);
            toastInfo(t('actions.procesing'))
            proyectosService.delete(id)
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

    async function remove_proovedor(id, form) {
        if (authContext.verify(location, "DELETE")) {
            toastInfo(t('actions.procesing'))
            return proveedoresService.delete(id)
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

    async function getPairWorkers(search) {
        if (authContext.verify(location, "GET")) {
            return proyectosService.getWorkers(search)
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

    async function list_csv(field = null, value = null) {
        if (authContext.verify(location, "GET")) {
            toastInfo(t('actions.procesing'));
            if (field && value) return proyectosService.search(1, 9999999, field, value)
                .then(res => (
                    res.data
                ))
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => toast.dismiss())
            else return proyectosService.list(1, 9999999)
                .then(res => (
                    res.data
                ))
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => toast.dismiss())
        } else {
            toast.warning(t('auth.nopermit'))
        }

    }

    const codRegex = /^\d\d\d\.\d\d\d\d$/i;

    useEffect(() => {
        list()
    }, []);


    const columns = [
        {
            name: t("pro.table.action"),
            width: '160px',
            omitCsv: true,
            component: row => <>
                <ButtonGroup>
                    {authContext.verify(location, "GET") ? <ProyectoShowMore id={row.id} /> : null}
                    {false ? <Facturas id={row.id} /> : null}
                    {authContext.verify(location, "PUT") ? <>
                        <Tooltip content={t('actions.edit')} placement="top">
                            <Button icon="helper-management" intent='warning' onClick={async () => await get(row)} />
                        </Tooltip>
                    </>
                        : null}
                    { 
                        // authContext.verify({ pathname: "/documentos" }, "GET")  && ( row.asignado || row.director ) ? <ProyectoEntregables  proyecto={row}/> : null
                    }
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
            name: t("pro.table.codigo"),
            value: "codigo",
            text: row => row.codigo,
            component: row => <>
                {row.estado === 1
                    ? <Tooltip content={t("general.pro_states.1")} placement="top">
                        <><span className={`bp5-icon bp5-icon-thumbs-up text-success`} /></>
                    </Tooltip>
                    : null}
                {row.estado === 0
                    ? <Tooltip content={t("general.pro_states.0")} placement="top">
                        <><span className={`bp5-icon bp5-icon-build text-danger`} /></>
                    </Tooltip>
                    : null}
                {row.estado === 2
                    ? <Tooltip content={t("general.pro_states.2")} placement="top">
                        <><span className={`bp5-icon bp5-icon-remove text-warning`} /></>
                    </Tooltip>
                    : null}
                {` ${row.codigo}`}
            </>
        },
        {
            name: t("pro.table.cotizacion"),
            value: "cotizacion",
            text: row => row.cotizacion,
        },
        {
            name: t("pro.table.fecha_inicio"),
            // value: "fecha_inicio",
            text: row => (row.fecha_inicio || '').substring(0, 7)
        },
        {
            name: t("pro.table.estado"),
            csvText: row => t("general.pro_states." + row.estado),
        },
        {
            name: t("pro.table.nombre"),
            value: "nombre",
            text: row => row.nombre,
        },
        {
            name: t("pro.table.cliente"),
            value: "tercero",
            text: row => row.cliente,
            component: row => row.id_cliente ?
            <TerceroShowMore id={row.id_cliente} text={row.cliente} />: row.cliente
        },
        {
            name: t("pro.table.location"),
            text: row => `${row.municipio ? row.municipio + ',' : ''} ${row.direccion || ''}`,
            omit: true,
        },
        {
            name: t("pro.table.municipio"),
            omit: true
        },
        {
            name: t("pro.table.direccion"),
            omit: true
        },
        {
            name: t("pro.table.propietario"),
            value: "propietario",
            omit: true,
            text: row => row.propietario,
        },
        {
            name: t("pro.table.curaduria"),
            value: "curaduria",
            omit: true,
            text: row => row.curaduria,
        },
        {
            name: t("pro.table.fecha_entrega"),
            // value: "fecha_entrega",
            text: row => row.fecha_entrega,
        },
        {
            name: t("pro.table.cliente_tipo"),
            csvText: row => t("general.doc_type." + row.cliente_tipo),
        },
        {
            name: t("pro.table.cliente_documento"),
            csvText: row => row.cliente_tipo === 'N' ? appContext.formatId(row.cliente_documento) : appContext.formatNit(row.cliente_documento),
        },
        {
            name: t("pro.table.base"),
            csvText: row => appContext.formatCurrency(row.base),
        },
        {
            name: t("pro.table.valor"),
            csvText: row => appContext.formatCurrency(row.valor),
        },
    ];

    const FORM = (i, f) => [
        {
            title: t('pro.form.section_1'),
            inputs: [
                [
                    { id: "codigo", required: true, defaultValue: i?.codigo, title: t('pro.form.codigo'), placeholder: t('pro.form.codigo'), icon: "tag", pattern: codRegex, validateText: t('pro.form.codigo_validate') },
                    { id: "nombre", required: true, defaultValue: i?.nombre, title: t('pro.form.nombre'), placeholder: t('pro.form.nombre'), icon: "tag", },
                    { id: "municipio", defaultValue: i?.municipio, title: t('pro.form.municipio'), placeholder: t('pro.form.municipio'), icon: "map-marker", type: "list", list: appContext.getCityList() },
                    { id: "direccion", defaultValue: i?.direccion, title: t('pro.form.direccion'), placeholder: t('pro.form.direccion'), icon: "home", },
                    { id: "propietario", defaultValue: i?.propietario, title: t('pro.form.propietario'), placeholder: t('pro.form.propietario'), icon: "person" },
                    { id: "curaduria", defaultValue: i?.curaduria, title: t('pro.form.curaduria'), placeholder: t('pro.form.curaduria'), icon: "tag" },
                ],
                [
                    { id: "fecha_inicio", defaultValue: i?.fecha_inicio, title: t('pro.form.fecha_inicio'), placeholder: t('pro.form.fecha_inicio'), type: "date" },
                    { id: "fecha_entrega", defaultValue: i?.fecha_entrega, title: t('pro.form.fecha_entrega'), placeholder: t('pro.form.fecha_entrega'), type: "date" },
                    { id: "estado", defaultValue: i?.estado, title: t('pro.form.estado'), placeholder: t('pro.form.estado'), icon: "folder-open", hide: !i, type: "select", list: Vars.pro_states.map(i => ({ value: i, text: t('general.pro_states.' + i) })) },
                ],
                [
                    { id: "observaciones", defaultValue: i?.observaciones, title: t('pro.form.observaciones'), placeholder: t('pro.form.observaciones'), type: "textarea" },
                ],
            ]
        },
        {
            title: t('facturas.form.section'),
            hide: !authContext.verify(location, "PUT"),
            inputs: [
                [
                    { id: "fac_descripcion", defaultValue: f?.descripcion, title: t('facturas.form.descripcion'), placeholder: t('facturas.form.descripcion'), icon: "tag" },
                    { id: "fac_fecha", defaultValue: f?.fecha, title: t('facturas.form.fecha'), placeholder: t('facturas.form.fecha'), type: "date" },
                    { id: "fac_estado", defaultValue: f?.estado, title: t('facturas.form.estado'), placeholder: t('facturas.form.estado'), icon: "dollar", type: 'select', list: Vars.facturas_estado.map(i => ({ value: i, text: t(`general.facturas_estado.${i}`) })) },

                ]
            ]
        },
        {
            title: t('proveedores.form.section'),
            hide: !authContext.verify(location, "PUT"),
            multiple: true,
            defaultValues: i?.proveedores,
            name: 'proveedores',
            deleteApi: remove_proovedor,
            deleteAllow: authContext.verify(location, "DELETE"),
            inputs: [
                [
                    { id: "tipo", index: 'tipo', title: t('proveedores.form.tipo'), placeholder: t('proveedores.form.tipo'), icon: "tag", type: 'select', list: Vars.proveedor_type.map(i => ({ value: i, text: t(`general.proveedor_type.${i}`) })) },
                    { id: "id_tercero", index: 'id_tercero', text: 'persona', title: t('proveedores.form.tercero'), placeholder: t('proveedores.form.tercero'), icon: "person", type: 'list', api: getPairWorkers },
                ],
            ]
        },
    ]

    const MODAL = (i, f) => <Dialog
        title={i ? t('pro.form.edit').replace('%VAR%', i.codigo) : t('pro.form.new')}
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
                onSubmit={(data) => manage_proyecto(data, i.id, f?.id)}
                groups={FORM(i, f)}
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
        <p>{t('actions.bodyDelete').replace('%VAR%', item?.nombre)}</p>

    </Alert>
    return (
        <div>
            {ALERT()}
            {MODAL(item, itemf)}
            <TableApp
                data={data}
                columns={columns}
                loading={isLoading}
                title={t("pro.table.title")}
                search
                btn={canCreate && authContext.verify(location, "POST")
                    ? <Button icon="add" text={t('actions.new')} intent="primary" onClick={() => {
                        setItem(null);
                        setModal(true);
                    }} />
                    : null}
                reload={list}
                reloadPag
                csv
                csvName={t("pro.table.csv")}
                csvApi={list_csv}
            />

        </div>

    );
}
