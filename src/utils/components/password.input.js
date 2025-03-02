import { Button, FormGroup, InputGroup, Tooltip } from "@blueprintjs/core";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export default function PasswordInput(props) {
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
        max,
    } = props
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const handleLockClick = useCallback(() => setShowPassword(value => !value), []);

    return <FormGroup
        helperText={helpText? (helpText || t('actions.validate')) : null}
        label={title}
        labelFor={id}
        labelInfo={required ? t('actions.required') : null}
        intent={intent}
        disabled={disabled}
        fill
        >
        <InputGroup
            intent={intent}
            id={id}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue || ''}
            onclick={onclick}
            onBlur={onBlur}
            onFocus={onFocus}
            onValueChange={onChange}
            leftIcon={icon}
            rightElement={
                <Tooltip content={`${showPassword ? t("actions.hidepass") : t("actions.showpass")}`} disabled={disabled}>
                    <Button
                        disabled={disabled}
                        icon={showPassword ? "unlock" : "lock"}
                        intent={'warning'}
                        onClick={handleLockClick}
                        variant="minimal"
                    />
                </Tooltip>
            }
            disabled={disabled}
            maxlength={max || 24}
            type={showPassword ? "text" : "password"}
        />
    </FormGroup>
}