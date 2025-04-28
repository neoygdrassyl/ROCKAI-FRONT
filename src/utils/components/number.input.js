import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function NumberInput(props) {
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
        icon,
        format,
        pattern,
        read,
    } = props
    const { t } = useTranslation();
    const [localValidate, setLocalValidate] = useState(false);


    const onBlurHandler = (e) => {
        let v = e.target.value;
        v = isNaN(v.replace(/\D/g,'')) ? 0 : v.replace(/\D/g,'');
        if (format && !read) {
            document.getElementById(id).value = format(v);
        }
        if (pattern && !read) {
            let isValidPattern = (v).match(pattern);
            if (!isValidPattern) setLocalValidate(true);
            else setLocalValidate(false);
        } else setLocalValidate(false);
        if (onBlur) onBlur(e);
    }

    const onChangeHandler = (e) => {
        const v = e.target.value;
        if (onChange) onChange(v);
    }

    const onFocusHandler = (e) => {
        if (!read) {
            const v = e.target.value;
            if (v === '0')  document.getElementById(id).value = '';
            else if (format && v ) document.getElementById(id).value = isNaN(v.replace(/\D/g,'')) ? 0 : v;
            if (onFocus) onBlur(e);
        }
    }

    const getDefaultValue = () => {
        if (defaultValue && format) return format(defaultValue);
        else if (defaultValue) return defaultValue;
        return 0;
    }

    return <div className={`bp5-form-group bp5-fill ${intent ? 'bp5-intent-' + intent : null} ${disabled ? 'disabled' : null}`}>
    {title ? <label className="bp5-label" for={id}>
        {title}
        {required ? <span className="bp5-text-muted">{t('actions.required')}</span> : null}
    </label> : null}
    <div className="bp5-form-content">
        <div className={`bp5-input-group bp5-fill ${intent ? 'bp5-intent-' + intent : null}`}>
        {icon ? <span className={`bp5-icon bp5-icon-${icon}`}></span> : null}
            <input type="text" inputmode="numeric"
                className={`bp5-input bp5-fill`}
                id={id}
                name={name}
                value={value}
                defaultValue={getDefaultValue()}
                placeholder={placeholder}
                disabled={disabled}
                onValueChange={onChangeHandler}
                onBlur={onBlurHandler}
                onclick={onclick}
                onFocus={onFocusHandler}
                readOnly={read}
                // max={max}
                // min={min}
                // step={1}
            />
        </div>
        {helpText ? <div className="bp5-form-helper-text">{helpText}</div> : null}
    </div>
</div>
}