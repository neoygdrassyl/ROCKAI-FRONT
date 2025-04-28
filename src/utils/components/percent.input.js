import { useTranslation } from "react-i18next";

export default function PercentInput(props) {
    const {
        id,  // REQUIRED
        value,
        name,
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
        readOnly,
    } = props
    const { t } = useTranslation();

    const onBlurHandler = (e) => {
        const v = e.target.value.replace(/\D/g, "");;
        if(v) document.getElementById(id).value = Number(v).toFixed(0);
        else document.getElementById(id).value = 0;
        if (onBlur) onBlur(e);
    }

    const onChangeHandler = (e) => {
        if (onChange) onChange(e);
    }

    const onFocusHandler = (e) => {

        if (onFocus) onBlur(e);
    }

    return <div className={`bp5-form-group bp5-fill ${intent ? 'bp5-intent-' + intent : null} ${disabled ? 'disabled' : null}`}>
    {title ? <label className="bp5-label" for={id}>
        {title}
        {required ? <span className="bp5-text-muted">{t('actions.required')}</span> : null}
    </label> : null}
    <div className="bp5-form-content">
        <div className={`bp5-input-group bp5-fill ${intent ? 'bp5-intent-' + intent : null}`}>
        {icon ? <span className={`bp5-icon bp5-icon-${icon}`}></span> : null}
            <input type="number"
                className={`bp5-input bp5-fill`}
                id={id}
                name={name}
                value={value}
                defaultValue={defaultValue}
                placeholder={placeholder}
                disabled={disabled}
                onValueChange={onChangeHandler}
                onBlur={onBlurHandler}
                onclick={onclick}
                onFocus={onFocusHandler}
                max={max}
                min={0}
                step={1}
                readOnly={readOnly}
            />
        </div>
        {helpText ? <div className="bp5-form-helper-text">{helpText}</div> : null}
    </div>
</div>
}