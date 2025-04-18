import { Button, Drawer, NonIdealState, Tooltip } from '@blueprintjs/core';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import proyectosService from '../../services/proyectos.service';
import { AppContext } from '../../utils/context/app.context';
import { toast } from 'react-toastify';
import { AuthContext } from '../../utils/context/auth.context.ts';
import { useLocation } from 'react-router';

export default function ProyectoShowMore(props) {
    const { id, text, icon } = props;
    const [isOpen, setOpen] = useState(false)
    const [item, setItem] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const { t } = useTranslation();
    const appContext = useContext(AppContext)
    const authContext = useContext(AuthContext)
    const location = useLocation()

    function view(id) {
        if (authContext.verify(location, "GET")) {
            setLoading(true)
            proyectosService.view(id)
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

    const body = (i) => (<div className='m-5'>
        <h4 className="mx-3">{`${t("pro.more.title_proyecto").replace('%VAR%', i.codigo)} `}
            {i.estado === 1
                ? <Tooltip content={t("general.pro_states.1")} placement="top">
                    <><span className={`bp5-icon bp5-icon-thumbs-up text-success`} /></>
                </Tooltip>
                : null}
            {item.estado === 0
                ? <Tooltip content={t("general.pro_states.0")} placement="top">
                    <><span className={`bp5-icon bp5-icon-build text-danger`} /></>
                </Tooltip>
                : null}
            {i.estado === 2
                ? <Tooltip content={t("general.pro_states.2")} placement="top">
                    <><span className={`bp5-icon bp5-icon-remove text-warning`} /></>
                </Tooltip>
                : null}
        </h4>
        <div className='row border p-3'>
            <div className='col'>{t("pro.more.nombre")}</div>
            <div className='col fw-bold'>{i?.nombre}</div>
        </div>
        <div className='row border p-3'>
            <div className='col'>{t("pro.more.localizacion")}</div>
            <div className='col fw-bold'>{i?.municipio || ''}, {i?.direccion || ''}</div>
        </div>
        <div className='row border p-3'>
            <div className='col'>{t("pro.more.fecha_inicio")}</div>
            <div className='col fw-bold'>{i?.fecha_inicio || ''}</div>
        </div>
        <div className='row border p-3'>
            <div className='col'>{t("pro.more.propietario")}</div>
            <div className='col fw-bold'>{i?.propietario || ''}</div>
        </div>
        <div className='row border p-3'>
            <div className='col'>{t("pro.more.curaduria")}</div>
            <div className='col fw-bold'>{i?.curaduria || ''}</div>
        </div>
        <div className='row border p-3'>
            <div className='col'>{t("pro.more.fecha_entrega")}</div>
            <div className='col fw-bold'>{i?.fecha_entrega || ''}</div>
        </div>
        <h4 className="m-3">{t("pro.more.title_cotizacion")}</h4>
        <div className='row border p-3'>
            <div className='col'>{t("pro.more.cotizacion")}</div>
            <div className='col fw-bold'>{i?.cotizacion || ''}</div>
        </div>
        <div className='row border p-3'>
            <div className='col'>{t("pro.more.fecha_cotizacion")}</div>
            <div className='col fw-bold'>{i?.fecha_cotizacion || ''}</div>
        </div>
        <div className='row border p-3'>
            <div className='col'>{t("pro.more.base")}</div>
            <div className='col fw-bold'>{appContext.cotMontoBase(i)}</div>
        </div>
        <div className='row border p-3'>
            <div className='col'>{t("pro.more.valor")}</div>
            <div className='col fw-bold'>{appContext.cotMontoTotal(i)}</div>
        </div>
        <div className='row border p-3'>
            <div className='col'>{t("pro.more.cotizador")}</div>
            <div className='col fw-bold'>{i?.cotizador || ''}</div>
        </div>
        <div className='row border p-3'>
            <div className='col'>{t("pro.more.contacto")}</div>
            <div className='col fw-bold'>{i?.correo || ''} - {i.telefono ? appContext.formatPhone(i.telefono) : ''}</div>
        </div>
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
            title={t("pro.more.title").replace("%VAR%", item?.codigo || '')}
            size={"default"}

        >
            {isLoading ? LOADING : item ? body(item) : NO_DATA}
        </Drawer>
    </>
    );
}
