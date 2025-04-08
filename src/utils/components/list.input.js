import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ListInput(props) {
    const {
        id,  // REQUIRED
        value,
        defaultValue,
        defaultText,
        disabled,
        list, // Array[{value, text}]
        placeholder,
        title,
        required,
        helpText,
        intent,
        onclick,
        onBlur,
        onFocus,
        onChange,
        onSelect,
        onKeyDown,
        icon,
        right,
        api,
        apiExt,
        useFill,
    } = props
    const { t } = useTranslation();
    const [apiList, setList] = useState([])
    const [loading, setLoading] = useState(null)
    const [fill] = useState(useFill === true || useFill === false ? useFill : true)

    useEffect(() => {
        document.getElementById(id).value = defaultValue || '';
    }, []);


    const onChangeHandler = async (e) => {
        if (api) {
            const search = e.target.value;
            for (let i = 0; i < apiList.length; i++) {
                const item = apiList[i];
                if (item.value === Number(search)) {
                    document.getElementById(id).value = item.value;
                    document.getElementById(id + '-ignore').value = item.text;
                    break;
                }
                document.getElementById(id).value = null;
            }
        }

        if (onChange) onChange(e)
    }

    const handleKeyDown = async (e) => {
        if (api) {
            const search = document.getElementById(id + '-ignore').value;
            if (!search) {
                setList([]);
                document.getElementById(id).value = null;
            }
            if (search.length > 2) {
                setLoading(true);
                const newList = await api(search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), apiExt || null );
                setLoading(false);
                setList(newList);
            }
        }
        if(onKeyDown) onKeyDown(e)

    }



    return <div className={`bp5-form-group bp5-${fill ? 'fill': ''} ${intent ? 'bp5-intent-' + intent : null} ${disabled ? 'disabled' : null}`}>
        {title ? <label className="bp5-label" for={id}>
            {title}
            {required ? <span className="bp5-text-muted">{t('actions.required')}</span> : null}
            {loading ? <span className="spinner-border spinner-border-sm text-warning ms-1" role="status" aria-hidden="true"></span> : null}
        </label> : null}
        <div className="bp5-form-content">
            <div className={`bp5-input-group bp5-${fill ? 'fill': ''} ${intent ? 'bp5-intent-' + intent : null}`}>
                {icon ? <span className={`bp5-icon bp5-icon-${icon}`}></span> : null}
                {api ? <input id={id} type="hidden" /> : null}
                <input id={api ? id + '-ignore' : id} list={"list-" + id} className="bp5-input" placeholder={placeholder} dir="auto" value={value} defaultValue={api ? defaultText : defaultValue}
                    onclick={onclick} onBlur={onBlur} onFocus={onFocus} onChange={onChangeHandler} disabled={disabled} onKeyDown={handleKeyDown}
                    search={false}
                />
                {right || null}
                <datalist id={"list-" + id}>
                    {api
                        ?
                        apiList.map(item => <option value={item.value}>{item.text}</option>)
                        : list.map(item => {
                            if (typeof item === 'string' || item instanceof String)
                                return <option value={item} />
                            else return <option value={item.value}>{item.text}</option>
                        })

                    }

                </datalist>
            </div>
            {helpText ? <div className="bp5-form-helper-text">{helpText}</div> : null}
        </div>
    </div>
}