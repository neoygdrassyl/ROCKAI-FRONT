import { FormGroup, TextArea } from "@blueprintjs/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function TextAreaInput(props) {
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

    return <FormGroup
        helperText={helpText || localValidate ? (helpText || t('actions.validate')) : null}
        label={title}
        labelFor={id}
        labelInfo={required ? t('actions.required') : null}
        intent={localValidate ? 'danger' : intent}
        disabled={disabled}
        fill
    >
        <TextArea
            intent={localValidate ? 'danger' : intent}
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            defaultValue={getDefaultValue()}
            onclick={onclick}
            onBlur={onBlurHandler}
            onFocus={onFocusHandler}
            onValueChange={onChange}
            disabled={disabled}
            readOnly={read}
            fill
            autoResize={true}
        />
    </FormGroup>
}