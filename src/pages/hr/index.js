import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { Alert, Button, ButtonGroup, Dialog, DialogBody, Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';

import empleadosService from '../../services/empleados.service';
import TableApp from '../../utils/components/table.component.js';
import { AuthContext } from '../../utils/context/auth.context.ts';
import FormComponent from '../../utils/components/form.component.js';
import { AppContext } from '../../utils/context/app.context.js';
import vars from "../../utils/json/variables.json"
import Personas from './personas.component.js';


export default function HRS() {
    const [dataEmpleados, setEmpleados] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [alert, setAlert] = useState(false)
    const [item, setItem] = useState(null)
    const [modal, setModal] = useState(false)
    const authContext = useContext(AuthContext)
    const appContext = useContext(AppContext)
    const location = useLocation()
    const { t } = useTranslation();

    const toastSuccess = (msg) => toast.success(msg);
    const toastInfo = (msg) => toast.info(msg, { autoClose: 1500, theme: "light", });
    const toastWarning = (msg) => toast.warning(msg);

    function getEmpleados() {
        if (authContext.verify(location, "GET")) {
            setLoading(true);
            empleadosService.list(1, 20)
                .then(res => {
                    setEmpleados(res.data);
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    setLoading(false);
                })
        } else {
            toastWarning(t('auth.nopermit'))
        }

    }

    function getEmpleado(i) {
        if (authContext.verify(location, "GET")) {
            empleadosService.get(i.id)
                .then(res => {
                    setItem(res.data);
                    setModal(true);
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {

                })
        } else {
            toastWarning(t('auth.nopermit'))
        }

    }

    function createEmpleados(form) {
        if (authContext.verify(location, "POST")) {
            setModal(false);
            toastInfo(t('actions.procesing'));
            empleadosService.create(form)
                .then(res => {
                    if (res.data) {
                        toast.dismiss();
                        toastSuccess(t('actions.creaated'));
                    }
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    getEmpleados();
                })
        } else {
            toastWarning(t('auth.nopermit'));
        }

    }

    function editEmpleado(id, form) {
        if (authContext.verify(location, "PUT")) {
            setModal(false);
            toastInfo(t('actions.procesing'))
            empleadosService.update(form, id)
                .then(res => {
                    if (res.data) {
                        toast.dismiss();
                        toastSuccess(t('actions.edited'));
                    }
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    getEmpleados();
                })
        } else {
            toastWarning(t('auth.nopermit'))
        }

    }

    function activateEmpleado(id, value) {
        if (authContext.verify(location, "PUT")) {
            setModal(false);
            toastInfo(t('actions.procesing'))
            empleadosService.activate({ active: value }, id)
                .then(res => {
                    if (res.data) {
                        toast.dismiss();
                        toastSuccess(t('actions.edited'));
                    }
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    getEmpleados();
                })
        } else {
            toastWarning(t('auth.nopermit'))
        }

    }

    function deleteEmpleado(id) {
        if (authContext.verify(location, "DELETE")) {
            setModal(false);
            toastInfo(t('actions.procesing'))
            empleadosService.delete(id)
                .then(res => {
                    if (res.data) {
                        toast.dismiss();
                        toastSuccess(t('actions.deleted'));
                    }
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    getEmpleados();
                })
        } else {
            toastWarning(t('auth.nopermit'))
        }

    }

    useEffect(() => {
        getEmpleados()
    }, []);


    const columns = [
        {
            name: t("hr.table.name"),
            text: row => row.nombre,
        },
        {
            name: t("hr.table.role"),
            text: row => t(`users.role.${row.cargo}`),
        },
        {
            name: t("hr.table.date_start"),
            text: row => row.fecha_inicio,
        },
        {
            name: t("hr.table.date_end"),
            text: row => row.fecha_fin,
        },
        {
            name: t("hr.table.action"),
            component: row => <>
                <ButtonGroup>
                    {authContext.verify(location, "PUT") ? <>
                        <Tooltip content={t('actions.active')} placement="top">
                            {row.active
                                ? <Button icon="lightbulb" intent='primary' onClick={() => activateEmpleado(row.id, false)} />
                                : <Button icon="lightbulb" onClick={() => activateEmpleado(row.id, true)} />
                            }
                        </Tooltip>
                        <Tooltip content={t('actions.edit')} placement="top">
                            <Button icon="edit" intent='warning' onClick={() => getEmpleado(row)} />
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

    const EMPLEADO_FORM = (i) => [
        {
            title: t('hr.form.section_1'),
            inputs: [
                [
                    { id: "name", required: true, defaultValue: i?.nombre, title: t('hr.form.nombre'), placeholder: t('hr.form.nombre'), icon: "person", },
                    { id: "cedula_nit", required: true, defaultValue: i?.cedula_nit, title: t('hr.form.cedula_nit'), placeholder: t('hr.form.cedula_nit'), icon: "id-number", format: appContext.formatId },
                    { id: "ciudad", defaultValue: i?.ciudad, title: t('hr.form.ciudad'), placeholder: t('hr.form.ciudad'), icon: "home", type: "list", list: appContext.getCityList() },
                    { id: "direccion", defaultValue: i?.direccion, title: t('hr.form.direccion'), placeholder: t('hr.form.direccion'), icon: "home", },
                ],
                [
                    { id: "telefono", defaultValue: i?.telefono, title: t('hr.form.telefono'), placeholder: t('hr.form.telefono'), icon: "phone", format: appContext.formatPhone },
                    { id: "correo", defaultValue: i?.correo, title: t('hr.form.correo'), placeholder: t('hr.form.correo'), icon: "at", pattern: appContext.emailPattern },
                    { id: "rut", defaultValue: i?.rut, title: t('hr.form.rut'), placeholder: t('hr.form.rut'), icon: "folder-open", disabled: true, },
                    { id: "cv", defaultValue: i?.cv, title: t('hr.form.cv'), placeholder: t('hr.form.cv'), icon: "folder-open", disabled: true, },
                ],
            ]
        },
        {
            title:  t('hr.form.section_2'),
            inputs: [
                [
                    { id: "cargo", defaultValue: i?.cargo, title: t('hr.form.cargo'), placeholder: t('hr.form.cargo'), icon: "hat", type: "select", list: vars.formRoles.map(i => ({ value: i, text: t(`users.role.${i}`, `users.role.NA`) })) },
                    { id: "salario", defaultValue: i?.salario, title: t('hr.form.salario'), placeholder: t('hr.form.salario'), icon: "dollar", type: 'number', format: appContext.formatCurrency, min: 0 },
                    { id: "contrato", defaultValue: i?.contrato, title: t('hr.form.contrato'), placeholder: t('hr.form.contrato'), icon: "document", type: "select", list: vars.contracts.map(i => ({ value: i, text: t(`users.contract.${i}`, `users.contract.NA`) })) },
                ],
                [
                    { id: "fecha_inicio", defaultValue: i?.fecha_inicio, title: t('hr.form.fecha_inicio'), placeholder: t('hr.form.fecha_inicio'), icon: "calendar", type: "date", },
                    { id: "fecha_fin", defaultValue: i?.fecha_fin, title: t('hr.form.fecha_fin'), placeholder: t('hr.form.fecha_fin'), icon: "calendar", type: "date", },
                ],
                [
                    { id: "login", defaultValue: i?.login, title: t('hr.form.login'), placeholder: t('hr.form.login'), icon: "user", required: i ? false : true, max: 64, read: i ? true : false, },
                    { id: "pass", defaultValue: null, title: t('hr.form.pass'), placeholder: t('hr.form.pass'), icon: "key", required: i ? false : true, type: "password", max: 16, hide: i ? true : false, },
                ],
            ]
        },
    ]

    const MODAL = (i) => <Dialog
        title={i ? t('hr.form.edit').replace('%VAR%', i.nombre) : t('hr.form.new')}
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
                onSubmit={(data) => i ? editEmpleado(i.id, data) : createEmpleados(data)}
                groups={EMPLEADO_FORM(i)}
            />
        </DialogBody>
    </Dialog>

    return (
        <div>
            <ToastContainer theme="colored" />
            <Alert
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
                    deleteEmpleado(item?.id);
                }}
            >
                <p>{t('actions.bodyDelete').replace('%VAR%', item?.nombre)}</p>
            </Alert>
            {MODAL(item)}
            <h2>{t("hr.title")}</h2>

            <TableApp
                data={dataEmpleados}
                columns={columns}
                loading={isLoading}
                title={t("hr.table.title")}
                id="empleados"
                search
                btn={authContext.verify(location, "POST") ? <Button icon="add" text={t('actions.new')} intent="primary" onClick={() => {
                    setItem(null);
                    setModal(true);
                }} /> : null}
                reload={getEmpleados}

            />

            <Personas />
        </div>

    );
}
