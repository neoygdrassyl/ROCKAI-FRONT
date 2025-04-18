import { Button, ButtonGroup, ControlGroup, Tooltip } from "@blueprintjs/core";
import { cloneElement, useEffect, useState } from "react";
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
    const [multControl, setMult] = useState({})
    const [isLoading, setLoading] = useState(false)
    const { t } = useTranslation();

    function onSubmitHandler() {
        // VALIDATES FORM
        let toValidate = []
        // FILLS THE FORM
        let form = {}
        groups.map(group => {
            group.inputs.map(inputs => {
                if (group.multiple) {
                    form[group.name] = []
                    let i = multControl[group.title];
                    for (let index = 0; index < i; index++) {
                        let localGroup = {}
                        inputs.map(input => {
                            let data = input;
                            if (!data.hide) {
                                let value;
                                value = document.getElementById(`${data.id}_${index}`).value;

                                if (data.required && (value === '' || value === null || value === undefined)) toValidate.push(data.id)
                                if (data.pattern && value) {
                                    let match = (value).match(data.pattern);
                                    if (!match) toValidate.push(data.id)
                                }
                                if (value !== '') {

                                    if (data.format && data.type !== "number") localGroup[input.index] = (value).replace(/\D/g, "");
                                    else if (data.format && data.type === "number") localGroup[input.index] = (value).match(/\d|\-/g).join('');
                                    else localGroup[input.index] = value;
                                }
                            }
                        })
                        const id = group.defaultValues ? group.defaultValues[index]?.id : null;
                        form[group.name].push({ ...localGroup, id });
                    }
                }
                else inputs.map(input => {
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
        // console.log(form)
        setValidate(toValidate);
        if (toValidate.length === 0) onSubmit(form ?? {});
    }

    const CONTROL = (rows, n = null) => (
        rows.map(inputs => <ControlGroup fill={true} vertical={false}>
            {n !== null && inputs[0].deleteAllow ?
                <Tooltip className="pt-4" content={t('actions.delete')} placement="top">
                    <Button icon="trash" intent='danger' onClick={() => {
                        if (inputs[0].itemId) {
                            setLoading(true);
                            inputs[0].deleteApi((inputs[0].itemId))
                        }
                        else removeMult(inputs[0].group, n);
                    }} />
                </Tooltip>
                : null}
            {inputs.map(input => {
                const IS_INVALID = validate.includes(input.id);
                if (n !== null) validate.includes(`${input.id}_${n}`);
                const INTENT = IS_INVALID ? "danger" : null;
                const HELP_TEXT = IS_INVALID ? (input.validateText || t('actions.validate')) : null;
                let PROPS = { ...input, intent: INTENT, helpText: HELP_TEXT }
                if (n !== null) PROPS = {
                    ...PROPS,
                    n: n,
                    id: `${input.id}_${n}`,
                    placeholder: `${input.placeholder} ${n + 1}`,
                    title: `${input.title} ${n + 1}`,
                }
                if (input.component) return cloneElement(input.component, { ...PROPS })
                if (input.type === "hidden") return <input type="hidden" {...PROPS} />
                if (input.type === "password" && !input.hide) return <PasswordInput {...PROPS} />
                if (input.type === "date" && !input.hide) return <DateInput {...PROPS} />
                if (input.type === "number" && !input.hide) return <NumberInput {...PROPS} />
                if (input.type === "percent" && !input.hide) return <PercentInput {...PROPS} />
                if (input.type === "select" && !input.hide) return <SelectInput {...PROPS} />
                if (input.type === "list" && !input.hide) return <ListInput {...PROPS} />
                if (!input.type && !input.hide) return <TextInput {...PROPS} />
            })}
        </ControlGroup>))


    const CONTROL_MULTIPLE = (group, i) => {
        if (i === null) return;
        const COMPONENT = [];

        for (let index = 0; index < i; index++) {
            const INPUTS = group.inputs.map(row => row.map(input => {
                input.deleteAllow = group.deleteAllow;
                input.deleteApi = group.deleteApi;
                input.group = group.title;
                if (group.defaultValues[index]) {
                    input.itemId = group.defaultValues[index].id;
                    input.defaultValue = group.defaultValues[index][input.index];
                    if (input.type === 'list') input.defaultText = group.defaultValues[index][input.text];
                } else {
                    input.itemId = null;
                    input.defaultValue = null;
                    if (input.type === 'list') input.defaultText = null;
                }
                return { ...input }

            }))
            COMPONENT.push(CONTROL(INPUTS, index))
        }

        return <>{COMPONENT}</>
    }

    const addMult = (id) => {
        let newMultControl = multControl;
        newMultControl[id] = newMultControl[id] + 1;
        setMult({ ...multControl, [id]: newMultControl[id] });
    }

    const removeMult = (id, n) => {
        let newMultControl = multControl;
        newMultControl[id] = newMultControl[id] - 1;
        if (newMultControl[id] === n) setMult({ ...multControl, [id]: newMultControl[id] });
        else {
            let inputs = [];
            groups.map(group => {
                if (group.title === id) group.inputs.map(row => row.map(input => {
                    inputs.push(input)
                }));
            })
            inputs.map(input => {
                for (let start = n; start < newMultControl[id]; start++) {
                    const next_input = input.id + '_' + (start + 1);
                    if (document.getElementById(next_input)) {
                        if (input.type === 'list') {
                            let value_copy_2 = document.getElementById(next_input + '-ignore').value;
                            document.getElementById(input.id + '_' + start + '-ignore').value = value_copy_2
                        }
                        let value_copy = document.getElementById(next_input).value;
                        document.getElementById(input.id + '_' + start).value = value_copy
                    }
                }
            })
            setMult({ ...multControl, [id]: newMultControl[id] });
        }
    }

    useEffect(() => {
        let newMultControl = {}
        groups.map(group => {
            if (group.multiple) newMultControl[group.title] = group.defaultValues?.length || 0;
        })
        setMult({ ...newMultControl })
    }, []);

    useEffect(() => {
        let newMultControl = {}
        groups.map(group => {
            if (group.multiple) newMultControl[group.title] = group.defaultValues?.length || 0;
        })
        setMult({ ...newMultControl })
        setLoading(false);
    }, [groups]);

    const LOADING = <div class="text-center">
        <div class="spinner-border" role="status">
        </div>
    </div>

    return <div className="form-app">
        {isLoading ? LOADING :
            groups.map(group => <>
                {group.hide
                    ? null
                    : <>
                        <div class="row">
                            <div class="col"><h6><strong>{group.title}</strong> </h6></div>
                            {group.multiple
                                ? <div class="col text-end">
                                    <ButtonGroup>
                                        <Button icon={'plus'} intent='primary' text={t('actions.add')} onClick={() => addMult(group.title)} />
                                    </ButtonGroup>
                                </div>
                                : null}

                        </div>

                        {group.multiple
                            ? CONTROL_MULTIPLE(group, multControl[group.title])
                            : CONTROL(group.inputs)}

                    </>}

            </>)
        }
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