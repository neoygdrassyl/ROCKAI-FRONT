import { Button, Drawer, NonIdealState, Tooltip } from '@blueprintjs/core';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import proyectosService from '../../services/proyectos.service';
import { AppContext } from '../../utils/context/app.context';
import { toast } from 'react-toastify';
import { AuthContext } from '../../utils/context/auth.context.ts';
import { useLocation } from 'react-router';

export default function Facturas(props) {
    const { id } = props;
    const [isOpen, setOpen] = useState(false)
    const [item, setItem] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const { t } = useTranslation();
    const appContext = useContext(AppContext)
    const authContext = useContext(AuthContext)
    const location = useLocation()


    return (<>
        <Tooltip content={t('facturas.title')} placement="top">
            <Button icon="dollar" intent='primary' onClick={() => {
                setOpen(true);
            }} />
        </Tooltip>
    </>
    );
}
