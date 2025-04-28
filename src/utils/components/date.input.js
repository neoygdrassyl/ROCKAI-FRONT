import { useTranslation } from "react-i18next";

export default function DateInput(props) {
    const {
        id,  // REQUIRED
        name,
        value,
        defaultValue,
        disabled,
        title,
        required,
        helpText,
        intent,
        onclick,
        onBlur,
        onFocus,
        onChange,
    } = props
    const { t } = useTranslation();



    return <div class={`bp5-form-group bp5-fill ${intent ? 'bp5-intent-' + intent : null} ${disabled ? 'disabled' : null}`}>
        {title ? <label class="bp5-label" for={id}>
            {title}
            {required ? <span class="bp5-text-muted">{t('actions.required')}</span> : null}
        </label> : null}
        <div class="bp5-form-content">
            <div class={`bp5-input-group bp5-fill ${intent ? 'bp5-intent-' + intent : null}`}>
                <input type="date" className={`bp5-input bp5-fill`}
                    id={id}
                    name={name}
                    value={value}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    onclick={onclick}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onChange={onChange}
                />
            </div>
            {helpText ? <div class="bp5-form-helper-text">{helpText}</div> : null}
        </div>
    </div>
}