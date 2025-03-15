import { Button, ButtonGroup, ControlGroup } from "@blueprintjs/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import SelectInput from "./select.input";
import TextInput from "./text.input";
import ListInput from "./list.input";
import NumberInput from "./number.input";
import DateInput from "./date.input";
import PasswordInput from "./password.input";
import PercentInput from "./percent.input";

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
                    if (!data.hide) {
                        let value;
                        value = document.getElementById(data.id).value;

                        if (data.required && (value === '' || value === null || value === undefined)) toValidate.push(data.id)
                        if (data.pattern && value) {
                            let match = (value).match(data.pattern);
                            if (!match) toValidate.push(data.id)
                        }
                        if (value !== '') {
                            if (data.format && data.type !== "number") form[data.id] = (value).replace(/\D/g, "");
                            else if (data.format && data.type === "number") form[data.id] = (value).match(/\d|\-/g).join('');
                            else form[data.id] = value;
                        }
                    }
                })
            }
            )
        })
        setValidate(toValidate);
        if (toValidate.length === 0) onSubmit(form ?? {});
    }

    return <div className="form-app">
        {groups.map(group => <>
            <h6><strong>{group.title}</strong></h6>
            {group.inputs.map(inputs => <ControlGroup fill={true} vertical={false}>
                {inputs.map(input => {

                    const IS_INVALID = validate.includes(input.id);
                    const INTENT = IS_INVALID ? "danger" : null;
                    const HELP_TEXT = IS_INVALID ? (input.validateText || t('actions.validate')) : null;
                    if (input.type === "hidden") return <input type="hidden" {...input} />
                    if (input.type === "password" && !input.hide) return <PasswordInput {...input} intent={INTENT} helpText={HELP_TEXT} />
                    if (input.type === "date" && !input.hide) return <DateInput {...input} intent={INTENT} helpText={HELP_TEXT} />
                    if (input.type === "number" && !input.hide) return <NumberInput {...input} intent={INTENT} helpText={HELP_TEXT} />
                    if (input.type === "percent" && !input.hide) return <PercentInput {...input} intent={INTENT} helpText={HELP_TEXT} />
                    if (input.type === "select" && !input.hide) return <SelectInput {...input} intent={INTENT} helpText={HELP_TEXT} />
                    if (input.type === "list" && !input.hide) return <ListInput {...input} intent={INTENT} helpText={HELP_TEXT} />
                    if (!input.type && !input.hide) return <TextInput {...input} intent={INTENT} helpText={HELP_TEXT} />

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