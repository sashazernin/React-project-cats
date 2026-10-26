import React, {useMemo, useState} from 'react';
import field from '../../../styles/outlinedField.module.css';
import c from './OutlinedSelect.module.css';
import {useOutsideClick} from '../../../features/hooks/useOutsideClick';

function parseOptions(children) {
    return React.Children.toArray(children).flatMap((child) => {
        if (!React.isValidElement(child) || child.type !== 'option') {
            return []
        }
        const rawValue = child.props.value
        const value = rawValue === undefined || rawValue === null ? '' : String(rawValue)
        return [{value, label: child.props.children}]
    })
}

const OutlinedSelect = ({label, name, value, onChange, children, className}) => {
    const [open, setOpen] = useState(false)
    const [rootRef] = useOutsideClick(open, () => setOpen(false))
    const options = useMemo(() => parseOptions(children), [children])
    const valueStr = value === undefined || value === null ? '' : String(value)
    const selected = options.find((opt) => opt.value === valueStr)
    const displayLabel = selected?.label ?? '—'

    const pick = (nextValue) => {
        onChange({target: {name, value: nextValue}})
        setOpen(false)
    }

    return (
        <div ref={rootRef} className={`${field.outlineRoot} ${c.wrap} ${className ?? ''}`}>
            <span className={field.outlineLegend}>{label}</span>
            <div className={field.outlineBox}>
                <div className={c.control}>
                    <button
                        type="button"
                        className={c.trigger}
                        aria-label={label}
                        aria-expanded={open}
                        aria-haspopup="listbox"
                        onClick={() => setOpen((was) => !was)}
                    >
                        <span className={c.triggerText}>{displayLabel}</span>
                        <span className={`${c.chevron} ${open ? c.chevronOpen : ''}`} aria-hidden="true"/>
                    </button>
                    {open && (
                        <ul className={c.list} role="listbox" aria-label={label}>
                            {options.map((opt) => {
                                const isSelected = opt.value === valueStr
                                return (
                                    <li key={`${name}-${opt.value}`} role="presentation">
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            className={isSelected ? `${c.option} ${c.optionActive}` : c.option}
                                            onClick={() => pick(opt.value)}
                                        >
                                            {opt.label}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OutlinedSelect;
