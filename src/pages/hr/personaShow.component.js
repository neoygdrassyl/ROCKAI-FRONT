import { Button, Drawer, NonIdealState, Tooltip } from '@blueprintjs/core';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import personasService from '../../services/personas.service.js';
import { AppContext } from '../../utils/context/app.context';
import { toast } from 'react-toastify';
import { AuthContext } from '../../utils/context/auth.context.ts';


export default function TerceroShowMore(props) {
    const { id, text, icon } = props;
    const [isOpen, setOpen] = useState(false)
    const [item, setItem] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const { t } = useTranslation();
    const appContext = useContext(AppContext)
    const authContext = useContext(AuthContext)

    function view(id) {
        if (authContext.verify({ pathname: "/hr" }, "GET")) {
            setLoading(true)
            personasService.get(id)
                .then(res => {
                    setItem(res.data);
                })
                .catch(error => appContext.errorHandler(error, toast, t))
                .finally(() => {
                    setLoading(false)
                })
        } else {
            toast.warning(t('auth.nopermit'))
        }
    }

    const TERCERO = (i) => <>
        <h4 className="mx-3">{`${t("hr.more.persona")}: ${ i.nombre}`} <Tooltip content={i.tipo === "N" ? t("personas.table.N") : t("personas.table.J")} placement="top">
                    <><span className={`bp5-icon bp5-icon-${i.tipo === "N" ? 'person' : 'book'} text-primary`} /></>
                </Tooltip>
        </h4>
        <div className='row border p-3'>
            <div className='col'>{t("hr.more.cedula_nit")}</div>
            <div className='col fw-bold'>{i.tipo === 'N' ? appContext.formatId(i.cedula_nit):  appContext.formatNit(i.cedula_nit)}</div>
        </div>
        <div className='row border p-3'>
            <div className='col'>{t("hr.more.telefono")}</div>
            <div className='col fw-bold'>{appContext.formatPhone( i?.telefono || '')}</div>
        </div>
        <div className='row border p-3'>
            <div className='col'>{t("hr.more.correo")}</div>
            <div className='col fw-bold'>{i?.correo	|| ''}</div>
        </div>
        <div className='row border p-3'>
            <div className='col'>{t("hr.more.ciudad")}</div>
            <div className='col fw-bold'>{i?.ciudad	|| ''}</div>
        </div>
        <div className='row border p-3'>
            <div className='col'>{t("hr.more.direccion")}</div>
            <div className='col fw-bold'>{i?.direccion || ''}</div>
        </div>
    </>


    const body = (i) => (<div className='m-5'>
        {TERCERO(i)}
    </div>)

    const LOADING = <div class="text-center mt-5 pt-5">
        <div class="spinner-border" role="status">
        </div>
    </div>

    const NO_DATA = <div className='p-5'>
        <NonIdealState
            icon={'help'}
            iconSize={44}
            title={t('table.nodata')}
            description={t('table.nodatast')}
            layout={'vertical'}
        />
    </div>

    return (<>
        <Tooltip content={t('actions.see_more')} placement="top">
            {text ? <div onClick={() => {
                setOpen(true);
                view(id)
            }}><span className={`bp5-icon bp5-icon-${icon || "eye-open"} text-primary`} />{` ${text}`}</div> :
                <Button icon={icon || "eye-open"} intent='primary' onClick={() => {
                    setOpen(true);
                    view(id)
                }} />
            }
        </Tooltip>
        <Drawer
            className={'rockai-drawer'}
            icon="info-sign"
            onClose={() => setOpen(false)}
            isOpen={isOpen}
            title={t("hr.more.title")}
            size={"default"}
        >
            <div className='app-drawer'>
                {isLoading ? LOADING : item ? body(item) : NO_DATA}
            </div>
        </Drawer>
    </>
    );
}
