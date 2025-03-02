import { Button, ButtonGroup, ControlGroup } from "@blueprintjs/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import SelectInput from "./select.input";
import TextInput from "./text.input";
import ListInput from "./list.input";
import NumberInput from "./number.input";
import DateInput from "./date.input";
import PasswordInput from "./password.input";

/* 
    groups: [
        [{INPUT}, {INPUT}]
    ]

    INPUT MODEL:
        type: string =  null (text) | numeric | cb | sw | select | radio | date | textarea | file | tag | pass |  slider?
        group: string = null
        id: string
        key: string
        intent
        disable
        fill
        inline

        onChange: func
        onBlur: func
        onClick: func,

        
        label = title
        labelFor
        labelInfo = required
        helperText = For Validation (is in danger)
        placeholder (when aplicable)
        
*/

export default function FormComponent(props) {
    const {
        groups,
        onSubmit,
        onSecondary,
        actions,
    } = props

    const [validate, setValidate] = useState([])
    const { t } = useTranslation();

    function onSubmitHandler() {
        // VALIDATES FORM
        let toValidate = []
        // FILLS THE FORM
        let form = {}
        groups.map(group => {
            group.inputs.map(inputs => {
                inputs.map(input => {
                    let data = input;
                    let value;
                    value = document.getElementById(data.id).value;
                    if (data.required && value === '') toValidate.push(data.id)
                    if (data.pattern && value) {
                        let match = (value).match(data.pattern);
                        if (!match) toValidate.push(data.id)
                    }
                    if (value !== '') {
                        if (data.format && data.type !== "number") form[data.id] = (value).replace(/\D/g, "");
                        else if (data.format && data.type === "number") form[data.id] = (value).match(/\d|\-/g).join('');
                        else form[data.id] = value;
                    }
                })
            }
            )
        })
        onSubmit(toValidate.length ? null : form);
        setValidate(toValidate);
    }

    return <div className="form-app">
        {groups.map(group => <>
            <h6><strong>{group.title}</strong></h6>
            {group.inputs.map(inputs => <ControlGroup fill={true} vertical={false}>
                {inputs.map(input => {

                    const IS_INVALID = validate.includes(input.id);
                    const INTENT = IS_INVALID ? "danger" : null;
                    const HELP_TEXT = IS_INVALID ? (input.validateText || t('actions.validate')) : null;
                    if (input.type === "password") return <PasswordInput {...input} intent={INTENT} helpText={HELP_TEXT} />
                    if (input.type === "date") return <DateInput {...input} intent={INTENT} helpText={HELP_TEXT} />
                    if (input.type === "number") return <NumberInput {...input} intent={INTENT} helpText={HELP_TEXT} />
                    if (input.type === "select") return <SelectInput {...input} intent={INTENT} helpText={HELP_TEXT} />
                    if (input.type === "list") return <ListInput {...input} intent={INTENT} helpText={HELP_TEXT} />
                    if (!input.type) return <TextInput {...input} intent={INTENT} helpText={HELP_TEXT} />

                })
                }
            </ControlGroup>)}
        </>)}
        <hr />
        <div className="row">
            <div className="col text-end">
                <ButtonGroup>
                    <Button icon={actions.primary?.icon || null} intent='primary' text={actions.primary?.text || null} onClick={onSubmitHandler} />
                    <Button icon={actions.secondary?.icon || null} text={actions.secondary?.text || null} onClick={onSecondary} />
                </ButtonGroup>
            </div>
        </div>
    </div>


}