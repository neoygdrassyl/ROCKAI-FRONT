import { useTranslation } from "react-i18next";

export default function ListInput(props) {
    const {
        id,  // REQUIRED
        value,
        defaultValue,
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
        icon,
        right,
    } = props
    const { t } = useTranslation();


    return <div class={`bp5-form-group bp5-fill ${intent ? 'intent-' + intent : null} ${disabled ? 'disabled' : null}`}>
        {title ? <label class="bp5-label" for={id}>
            {title}
            {required ? <span class="bp5-text-muted">{t('actions.required')}</span> : null}
        </label> : null}
        <div class="bp5-form-content">
            <div class={`bp5-input-group bp5-fill ${intent ? 'intent-' + intent : null}`}>
                {icon ? <span class={`bp5-icon bp5-icon-${icon}`}></span> : null}
                <input id={id} list={"list-" + id} class="bp5-input" placeholder={placeholder} dir="auto" value={value} defaultValue={defaultValue}
                    onclick={onclick} onBlur={onBlur} onFocus={onFocus} onChange={onChange} disabled={disabled}
                />
                {right ? <span class={`bp5-icon bp5-icon-${icon}`}></span> : null}
                <datalist id={"list-" + id}>
                    {
                        list.map(item => {
                            if (typeof item === 'string' || item instanceof String)
                                return <option value={item} />
                            else return <option value={item.value}>{item.text}</option>
                        })
                    }

                </datalist>
            </div>
            {helpText ? <div class="bp5-form-helper-text">{helpText}</div> : null}
        </div>
    </div>
}