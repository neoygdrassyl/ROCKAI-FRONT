import { FormGroup, NumericInput } from "@blueprintjs/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function NumberInput(props) {
    const {
        id,  // REQUIRED
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
        max,
        min,
        readOnly,
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
        if (format && e.target.value) document.getElementById(id).value = ( e.target.value).match(/\d|\-/g).join('');
        if (onFocus) onBlur(e)
    }

    return <FormGroup
        helperText={helpText || localValidate ? (helpText || t('actions.validate')) : null}
        label={title}
        labelFor={id}
        labelInfo={required ? t('actions.required') : null}
        intent={localValidate ? 'danger' : intent}
        disabled={disabled}
        fill
        >
         <NumericInput
                id={id}
                allowNumericCharactersOnly={true}
                placeholder={placeholder}
                buttonPosition={'right'}
                disabled={disabled}
                fill
                intent={intent}
                leftIcon={icon}
                max={max}
                min={min}
                onValueChange={onChange}
                onBlur={onBlurHandler}
                selectAllOnFocus={false}
                selectAllOnIncrement={false}
                value={value || defaultValue}
                readOnly={readOnly}
                onclick={onclick}
                onFocus={onFocusHandler}
            />
    </FormGroup>
}