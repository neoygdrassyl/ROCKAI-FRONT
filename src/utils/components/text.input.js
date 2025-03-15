import { FormGroup, InputGroup } from "@blueprintjs/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function TextInput(props) {
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
        right,
        format,
        pattern,
        max,
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
        <InputGroup
            intent={localValidate ? 'danger' : intent}
            id={id}
            placeholder={placeholder}
            value={value}
            defaultValue={getDefaultValue()}
            onclick={onclick}
            onBlur={onBlurHandler}
            onFocus={onFocusHandler}
            onValueChange={onChange}
            leftIcon={icon}
            rightElement={right}
            disabled={disabled}
            maxlength={max || 127}
            readOnly={read}
        />
    </FormGroup>
}