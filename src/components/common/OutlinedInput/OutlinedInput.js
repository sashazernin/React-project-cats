import React from 'react';
import field from '../../../styles/outlinedField.module.css';
import c from './OutlinedInput.module.css';

const OutlinedInput = ({label, className, fieldClassName, ...inputProps}) => (
    <div className={`${field.outlineRoot} ${fieldClassName ?? ''} ${className ?? ''}`}>
        <span className={field.outlineLegend}>{label}</span>
        <div className={field.outlineBox}>
            <input className={c.input} {...inputProps} />
        </div>
    </div>
);

export default OutlinedInput;
