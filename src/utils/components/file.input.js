import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FileInput(props) {
    const {
        id,  // REQUIRED
        name,
        value,
        defaultValue,
        placeholder,
        disabled,
        title,
        required,
        helpText,
        intent,
        onclick,
        onBlur,
        onFocus,
        onChange,
        format,
        pattern,
        read,
    } = props
    const { t } = useTranslation();
    const [localValidate, setLocalValidate] = useState(false)

    const onBlurHandler = (e) => {
        const value = e.target.value
        if (format) document.getElementById(id).value = format(value);
        if (pattern && value) {
            let isValidPattern = (value).match(pattern)
            if (!isValidPattern) setLocalValidate(true)
            else setLocalValidate(false)
        } else setLocalValidate(false)
        if (onBlur) onBlur(e)
    }

    const onFocusHandler = (e) => {
        if (format) document.getElementById(id).value = (e.target.value).replace(/\D/g, "");
        if (onFocus) onBlur(e)
    }

    const getDefaultValue = () => {
        if (defaultValue && format) return format(defaultValue)
        else if (defaultValue) return defaultValue
        else return ''
    }

    const onChangeHandler = (e) => {
        if (e) onChange(e)
    }

    return <div className={`bp5-form-group ${intent ? 'bp5-intent-' + intent : null} ${disabled ? 'disabled' : null}`}>
        {title ? <label className="bp5-label" for={id}>
            {title}
            {required ? <span className="bp5-text-muted">{t('actions.required')}</span> : null}
        </label> : null}
        <div className="bp5-form-content">
            <div className={`bp5-input-group bp5-file-input-has-selection ${intent ? 'bp5-intent-' + intent : null}`}>
                <label className="bp5-file-input">
                    <input id={id} className="bp5-file-input-has-selection" type="file" read={read}
                    name={name}
                    onChange={(e) => onChangeHandler(e)}
                    />
                    <span className="bp5-file-upload-input">{placeholder}</span>
                </label>
            </div>
            {helpText ? <div className="bp5-form-helper-text">{helpText}</div> : null}
        </div>
    </div>


}