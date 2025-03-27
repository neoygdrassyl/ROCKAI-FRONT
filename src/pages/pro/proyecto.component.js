import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { Alert, Button, ButtonGroup, Dialog, DialogBody, Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import proyectosService from '../../services/proyectos.service.js';
import TableApp from '../../utils/components/table.component.js';
import { AuthContext } from '../../utils/context/auth.context.ts';
import FormComponent from '../../utils/components/form.component.js';
import { AppContext } from '../../utils/context/app.context.js';
import ProyectoShowMore from './proyectoShow.component.js';

export default function Proyectos(props) {
    const [data, setData] = useState([])
    const [item, setItem] = useState(null)
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

    function get(i) {
        if (authContext.verify(location, "GET")) {
            proyectosService.get(i.id)
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
            proyectosService.update(form, id)
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

    async function list_csv(field = null, value = null) {
            if (authContext.verify(location, "GET")) {
                toastInfo(t('actions.procesing'));
                if (field && value) return proyectosService.search(1, 9999999, field, value)
                    .then(res => (
                        res.data
                    ))
                    .catch(error => appContext.errorHandler(error, toast, t))
                    .finally(() =>  toast.dismiss())
                else return proyectosService.list(1, 9999999)
                    .then(res => (
                        res.data
                    ))
                    .catch(error => appContext.errorHandler(error, toast, t))
                    .finally(() =>  toast.dismiss())
            } else {
                toast.warning(t('auth.nopermit'))
            }
    
        }

    useEffect(() => {
        list()
    }, []);


    const columns = [
        {
            name: t("pro.table.codigo"),
            value: "codigo",
            text: row => row.codigo,
            component: row => <>
                {row.estado === 1
                    ? <Tooltip content={t("pro.table.shiped")} placement="top">
                        <><span className={`bp5-icon bp5-icon-thumbs-up text-success`} /></>
                    </Tooltip>
                    : null}
                {row.estado === 0
                    ? <Tooltip content={t("pro.table.in_progress")} placement="top">
                        <><span className={`bp5-icon bp5-icon-build text-danger`} /></>
                    </Tooltip>
                    : null}
                {` ${row.codigo}`}
            </>
        },
        {
            name: t("pro.table.estado"),
            csvText: row => row.estado === 1 ? t("pro.table.shiped") : t("pro.table.in_progress"),
        },
        {
            name: t("pro.table.nombre"),
            value: "nombre",
            text: row => row.nombre,
        },
        {
            name: t("pro.table.location"),
            text: row => `${row.municipio ? row.municipio + ',' : ''} ${row.direccion || ''}`,
        },
        {
            name: t("pro.table.municipio"),
            value: "municipio",
            omit: true
        },
        {
            name: t("pro.table.direccion"),
            value: "direccion",
            omit: true
        },
        {
            name: t("pro.table.fecha_inicio"),
            value: "fecha_inicio",
            text: row => row.fecha_inicio,
        },
        {
            name: t("pro.table.fecha_entrega"),
            value: "fecha_entrega",
            text: row => row.fecha_entrega,
        },
        {
            name: t("pro.table.cliente"),
            csvText: row => row.cliente,
        },
        {
            name: t("pro.table.cliente_tipo"),
            csvText: row => t("general.doc_type."+ row.cliente_tipo),
        },
        {
            name: t("pro.table.cliente_documento"),
            csvText: row =>  row.cliente_tipo === 'N' ? appContext.formatId(row.cliente_documento):  appContext.formatNit(row.cliente_documento),
        },
        {
            name: t("pro.table.base"), 
            csvText: row => appContext.formatCurrency(row.base),
        },
        {
            name: t("pro.table.valor"),
            csvText: row => appContext.formatCurrency(row.valor),
        },
        {
            name: t("pro.table.action"),
            width: '120px',
            omitCsv: true,
            component: row => <>
                <ButtonGroup>
                    {authContext.verify(location, "GET") ? <ProyectoShowMore id={row.id} /> : null}
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
            title: t('pro.form.section_1'),
            inputs: [
                [
                    { id: "codigo", required: true, defaultValue: i?.codigo, title: t('pro.form.codigo'), placeholder: t('pro.form.codigo'), icon: "tag", },
                    { id: "nombre", required: true, defaultValue: i?.nombre, title: t('pro.form.nombre'), placeholder: t('pro.form.nombre'), icon: "tag", },
                    { id: "municipio", defaultValue: i?.municipio, title: t('pro.form.municipio'), placeholder: t('pro.form.municipio'), icon: "map-marker", type: "list", list: appContext.getCityList() },
                    { id: "direccion", defaultValue: i?.direccion, title: t('pro.form.direccion'), placeholder: t('pro.form.direccion'), icon: "home", },
                ],
                [
                    { id: "fecha_inicio", defaultValue: i?.fecha_inicio, title: t('pro.form.fecha_inicio'), placeholder: t('pro.form.fecha_inicio'), type: "date" },
                    { id: "fecha_entrega", defaultValue: i?.fecha_entrega, title: t('pro.form.fecha_entrega'), placeholder: t('pro.form.fecha_entrega'), type: "date" },
                    { id: "estado", defaultValue: i?.estado, title: t('pro.form.estado'), placeholder: t('pro.form.estado'), icon: "folder-open", hide: !i, type: "select", list: [{ value: 0, text: t('pro.form.open') }, { value: 1, text: t('pro.form.close') }] },
                ],
            ]
        },
    ]

    const MODAL = (i) => <Dialog
        title={i ? t('pro.form.edit').replace('%VAR%', i.nombre) : t('pro.form.new')}
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
        <p>{t('actions.bodyDelete').replace('%VAR%', item?.nombre)}</p>

    </Alert>
    return (
        <div>
            {ALERT()}
            {MODAL(item)}
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
                csvName={ t("pro.table.csv")}
                csvApi={list_csv}
            />

        </div>

    );
}
