import { useTranslation } from "react-i18next";
import SelectInput from "../../utils/components/select.input";
import TextInput from "../../utils/components/text.input";
import Vars from "../../utils/json/variables.json"
import { useEffect, useState } from "react";

export default function Servicios_Builder(props) {
    const {
        id,
        defaultValue,
        n,
    } = props
    const [proceso, serProceso] = useState(defaultValue ? defaultValue.split("-")[1] : Vars.servicios_procesos[0]);
    const [clase, setClase] = useState(defaultValue ? defaultValue.split("-")[0] : Vars.servicios_clases[0]);
    const [comentario, setComentario] = useState(defaultValue ? defaultValue.split("-")[2] : "");
    const [codigo, setCodigo] = useState(defaultValue || "");
    const { t } = useTranslation();

    function buildCodigo() {
        let cod = "";
        cod += clase;
        cod += "-";
        cod += proceso;
        cod += "-";
        cod += comentario;
        setCodigo(cod);
    }

    useEffect(() => {
        buildCodigo();
    }, []);

    useEffect(() => {
        buildCodigo();
    }, [proceso, clase, comentario]);

    return <>
        <SelectInput id={"servicios_code_2"} title={t('servicios.form.clase') + " " + (n + 1)} value={clase} onChange={(e) => setClase(e.target.value)} list={Vars.servicios_clases.map(i => ({ value: i, text: t('servicios.clases.' + i) }))} icon="properties"/>
        <SelectInput id={"servicios_code_1"} title={t('servicios.form.proceso') + " " + (n + 1)} value={proceso} onChange={(e) => serProceso(e.target.value)} list={Vars.servicios_procesos.map(i => ({ value: i, text: t('servicios.procesos.' + i) }))}  icon="properties" />
        <TextInput id={"servicios_code_3"} title={t('servicios.form.comentario') + " " + (n + 1)} defaultValue={comentario} onBlur={(e) => setComentario(e.target.value)} icon="comment"/>
        <TextInput id={id} title={t('servicios.form.codigo') + " " + (n + 1)} value={codigo} read  icon="label" />
    </>
}