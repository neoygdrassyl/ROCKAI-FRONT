import { Button, Dialog, DialogBody, Drawer, NonIdealState, Tooltip } from '@blueprintjs/core';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import proyectosService from '../../services/proyectos.service';
import { AppContext } from '../../utils/context/app.context';
import { toast } from 'react-toastify';
import { AuthContext } from '../../utils/context/auth.context.ts';
import { useLocation } from 'react-router';

export default function ProyectoEntregables(props) {
    const { proyecto, icon } = props;
    const [modal, setModal] = useState(false)
    const [item, setItem] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const { t } = useTranslation();
    const appContext = useContext(AppContext)
    const authContext = useContext(AuthContext)
    const location = useLocation()



    const MODAL = (i) => <Dialog
        title={t('pro.form.edit').replace('%VAR%', i.codigo)}
        icon={"edit"}
        isOpen={modal} onClose={() => setModal(false)}
        className='modal-app'>
        <DialogBody useOverflowScrollContainer={true} >
            Hello wolrd!
        </DialogBody>
    </Dialog>

    return (<>
        {MODAL(proyecto)}
        <Tooltip content={t('pro.entregables')} placement="top">
            <Button icon={icon || "projects"} intent='warning' onClick={() => setModal(true)} />
        </Tooltip>

    </>
    );
}
