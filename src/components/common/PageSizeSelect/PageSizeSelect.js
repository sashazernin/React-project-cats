import React from 'react';
import c from './PageSizeSelect.module.css';

export const PAGE_SIZE_OPTIONS = [20, 40, 100];

const PageSizeSelect = ({value, onChange, disabled, label = 'Per page'}) => (
    <label className={c.label}>
        <span className={c.labelText}>{label}</span>
        <select
            className={c.select}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label={label}
        >
            {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>{size}</option>
            ))}
        </select>
    </label>
);

export default PageSizeSelect;
