import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { Alert, Button, ButtonGroup, Dialog, DialogBody, Tooltip } from '@blueprintjs/core';
import { AuthContext } from "../../utils/context/auth.context.ts";
import { AppContext } from "../../utils/context/app.context.js";
import personasService from "../../services/personas.service.js";
import TableApp from "../../utils/components/table.component.js";
import FormComponent from "../../utils/components/form.component.js";

export default function Personas() {
    const [data, setData] = useState([])
    const [item, setItem] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [alert, setAlert] = useState(false)
    const [modal, setModal] = useState(false)
    const [personType, setPersonType] = useState('N')
    const authContext = useContext(AuthContext)
    const appContext = useContext(AppContext)
    const location = useLocation()
    const { t } = useTranslation();
    const toastInfo = (msg) => toast.info(msg, { autoClose: 1500, theme: "light", });

    function list(page = 1, pageSize = 20, field, value) {
        if (authContext.verify(location, "GET")) {
            setLoading(true);
            if (field && value) personasService.search(page, pageSize, field, value)
                .then(res => {
                    setData(res.data);
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    setLoading(false);
                })
            else personasService.list(page, pageSize)
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
            personasService.get(i.id)
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
            personasService.update(form, id)
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
            personasService.delete(id)
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

    function onChangePersonType(e) {
        setPersonType(e.target.value)
    }

    useEffect(() => {
        list()
    }, []);


    const columns = [
        {
            name: t("personas.table.nombre"),
            value: "nombre",
            text: row => row.nombre,
            component: row => <>
                <Tooltip content={row.tipo === "N" ? t("personas.table.N") : t("personas.table.J")} placement="top">
                    <><span className={`bp5-icon bp5-icon-${row.tipo === "N" ? 'person' : 'book'} text-primary`} /></>
                </Tooltip>
                {` ${row.nombre}`}
            </>
        },
        {
            name: t("personas.table.cedula_nit"),
            value: "cedula_nit",
            text: row => row.cedula_nit,
            component: row => row.tipo === 'N' ? appContext.formatId(row.cedula_nit):  appContext.formatNit(row.cedula_nit),
        },
        {
            name: t("personas.table.telefono"),
            value: "telefono",
            text: row => row.telefono,
            component: row => appContext.formatPhone(row.telefono)
        },
        {
            name: t("personas.table.correo"),
            value: "correo",
            text: row => row.correo,
        },
        {
            name: t("personas.table.action"),
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
            title: t('personas.form.section_1'),
            inputs: [
                [
                    { id: "tipo", defaultValue: i?.tipo || personType, title: t('personas.form.tipo'), placeholder: t('personas.form.tipo'), icon: "tag", type: "select", list: [{ value: 'N', text: t('personas.form.N') }, { value: 'J', text: t('personas.form.J') }], onChange: onChangePersonType },
                    { id: "name", required: true, defaultValue: i?.nombre, title: t('personas.form.nombre'), placeholder: t('personas.form.nombre'), icon: "person", },
                    { id: "cedula_nit", required: true, defaultValue: i?.cedula_nit, title: t('personas.form.cedula_nit'), placeholder: t('personas.form.cedula_nit'), icon: "id-number", format: personType === 'N' ? appContext.formatId : appContext.formatNit},
                    { id: "ciudad", defaultValue: i?.ciudad, title: t('personas.form.ciudad'), placeholder: t('personas.form.ciudad'), icon: "home", type: "list", list: appContext.getCityList() },
                    { id: "direccion", defaultValue: i?.direccion, title: t('personas.form.direccion'), placeholder: t('personas.form.direccion'), icon: "home", },
                ],
                [
                    { id: "telefono", defaultValue: i?.telefono, title: t('personas.form.telefono'), placeholder: t('personas.form.telefono'), icon: "phone", format: appContext.formatPhone },
                    { id: "correo", defaultValue: i?.correo, title: t('personas.form.correo'), placeholder: t('personas.form.correo'), icon: "at", pattern: appContext.emailPattern },
                    { id: "rut", defaultValue: i?.rut, title: t('personas.form.rut'), placeholder: t('personas.form.rut'), icon: "folder-open", disabled: true, },
                    { id: "cv", defaultValue: i?.cv, title: t('personas.form.cv'), placeholder: t('personas.form.cv'), icon: "folder-open", disabled: true, },
                ],
            ]
        },
    ]

    const MODAL = (i) => <Dialog
        title={i ? t('personas.form.edit').replace('%VAR%', i.nombre) : t('personas.form.new')}
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
            <hr />
            {ALERT()}
            {MODAL(item)}
            <TableApp
                data={data}
                columns={columns}
                loading={isLoading}
                title={t("personas.table.title")}
                id="personas"
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