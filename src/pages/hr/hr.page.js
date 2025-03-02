import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { Button, ButtonGroup, Dialog, DialogBody, Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';

import empleadosService from '../../services/empleados.service';
import TableApp from '../../utils/components/table.component.js';
import { AuthContext } from '../../utils/context/auth.context.ts';
import FormComponent from '../../utils/components/form.component.js';
import { AppContext } from '../../utils/context/app.context.js';
import vars from "../../utils/json/variables.json"

export default function HRS() {
    const [dataEmpleados, setEmpleados] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [modal, setModal] = useState(false)
    const authContext = useContext(AuthContext)
    const appContext = useContext(AppContext)
    const location = useLocation()
    const { t } = useTranslation();

    const toastError = (msg) => toast.error(msg);
    const toastSuccess = (msg) => toast.success(msg);
    const toastWarning = (msg) => toast.warning(msg);

    function getEmpleados() {
        if (authContext.verify(location, "GET")) {
            setLoading(true);
            empleadosService.list(1, 20)
                .then(res => {
                    setEmpleados(res.data);
                })
                .catch(error => {
                    console.error(error);
                    if (error.status == 403) toastWarning(t('auth.nopermit'))
                    else toastError(t('auth.error_generic'))
                })
                .finally(() => {
                    setLoading(false);
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
            name: 'Nombre',
            text: row => row.nombre,
        },
        {
            name: 'Cargo',
            text: row => row.cargo,
        },
        {
            name: 'Fecha Inicio',
            text: row => row.fecha_inicio,
        },
        {
            name: 'Fecha Inicio',
            text: row => row.fecha_fin,
        },
        {
            name: 'Accion',
            component: row => <>
                <ButtonGroup>
                    {authContext.verify(location, "PUT") ?
                        <Tooltip content={t('actions.edit')} placement="top">
                            <Button icon="edit" intent='warning' />
                        </Tooltip>
                        : null}
                    {authContext.verify(location, "DELETE") ?
                        <Tooltip content={t('actions.delete')} placement="top">
                            <Button icon="trash" intent='danger' />
                        </Tooltip>
                        : null}
                </ButtonGroup>
            </>,
        },
    ];

    const EMPLEADO_FORM = [
        {
            title: "Datos Personales",
            inputs: [
                [
                    { id: "name", required: true, title: "Nomnre", placeholder: "Nombre", icon: "person", },
                    { id: "cedula_nit", required: true, title: "Cédula", placeholder: "Cédula", icon: "id-number", format: appContext.formatId },
                    { id: "ciudad", title: "Ciudad", placeholder: "Ciudad", icon: "home", type: "list", list: appContext.getCityList() },
                    { id: "direccion", title: "Dirección", placeholder: "Dirección", icon: "home", },
                ],
                [


                    { id: "telefono", title: "Teléfono", placeholder: "Teléfono", icon: "phone", format: appContext.formatPhone },
                    { id: "correo", title: "Correo", placeholder: "Correo", icon: "at", pattern: appContext.emailPattern },
                    { id: "rut", title: "RUT", placeholder: "RUT", icon: "folder-open", disabled: true, },
                    { id: "cv", title: "Hoja de Vida", placeholder: "Hoja de Vida", icon: "folder-open", disabled: true, },
                ],
            ]
        },
        {
            title: "Datos Empleado",
            inputs: [
                [
                    { id: "cargo", title: "Cargo", placeholder: "Cargo", icon: "hat", type: "select", list: vars.formRoles.map(i => ({ value: i, text: t(`users.role.${i}`, `users.role.NA`) })) },
                    { id: "salario", title: "Salario", placeholder: "Salario", icon: "dollar", type: 'number', format: appContext.formatCurrency },
                    { id: "contrato", title: "Contrato", placeholder: "Contrato", icon: "document", disabled: true, },
                ],
                [

                    { id: "fecha_inicio", title: "Fecha Inicio", placeholder: "Fecha Inicio", icon: "calendar", type: "date", },
                    { id: "fecha_final", title: "Fecha Final", placeholder: "Fecha Final", icon: "calendar", type: "date", },
                ],
                [
                    { id: "login", title: "Nombre de Usuario", placeholder: "Nombre de Usuario", icon: "user", required: true, max: 20, },
                    { id: "pass", title: "Contraseña", placeholder: "Contraseña", icon: "key", required: true, type: "password" },
                ],
            ]
        },
    ]

    const MODAL = () => <Dialog title="New Empleado" icon="add" isOpen={modal} onClose={() => setModal(false)} className='modal-app'>
        <DialogBody useOverflowScrollContainer={true} >
            <FormComponent
                actions={{
                    primary: { icon: "add", text: t('actions.new') },
                    secondary: { icon: "cross", text: t('actions.close') }
                }}
                onSecondary={() => setModal(false)}
                onSubmit={(data) => console.log(data)}
                groups={EMPLEADO_FORM}
            />
        </DialogBody>
    </Dialog>

    return (
        <div>
            <ToastContainer theme="colored" />
            {MODAL()}
            <h2>Recursos Humanos</h2>

            <TableApp
                data={dataEmpleados}
                columns={columns}
                loading={isLoading}
                title={"Empleados"}
                search
                btn={authContext.verify(location, "POST") ? <Button icon="add" text={t('actions.new')} intent="primary" onClick={() => setModal(true)} /> : null}

            />
        </div>

    );
}
