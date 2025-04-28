import { useTranslation } from "react-i18next";

export default function SelectInput(props) {
    const {
        id,  // REQUIRED
        name,
        value,
        defaultValue,
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
        icon,
        read,
        right,
    } = props
    const { t } = useTranslation();


    return <div className={`bp5-form-group bp5-fill ${intent ? 'intent-' + intent : null}`}>
        {title ? <label className="bp5-label" for={id}>
            {title}
            {required ? <span className="bp5-text-muted">{t('actions.required')}</span> : null}
        </label> : null}
        <div className="bp5-form-content bp5-fill">
            <div className={`bp5-input-group bp5-fill ${intent ? 'intent-' + intent : null}`}>
                {icon ? <span className={`bp5-icon bp5-icon-${icon}`}></span> : null}
                <select 
                id={id} 
                name={name}
                className="bp5-select" 
                placeholder={placeholder} 
                dir="auto" 
                value={value} 
                defaultValue={defaultValue}
                disabled={read}
                onclick={onclick} onBlur={onBlur} onFocus={onFocus} onChange={onChange} 
                >
                 <span className={`bp5-icon bp5-icon-chevron-down`}></span>

                    {
                        list.map(item => {
                            if (typeof item === 'string' || item instanceof String)
                                return <option value={item} />
                            else return <option value={item.value}>{item.text}</option>
                        })
                    }

                </select >
            </div>
            {helpText ? <div className="bp5-form-helper-text">{helpText}</div> : null}
        </div>
    </div>
}