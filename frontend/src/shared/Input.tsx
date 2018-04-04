import * as React from "react";

export interface IInputProps {
    id: string
    inputClassOverride?: string
    label: string
    name: string
    onChange: (value: any) => void
    required?: boolean
    type?: string
    value: any
}

export const Input : React.StatelessComponent<IInputProps> = ({id, inputClassOverride = "", label, name, onChange, required = false, type="text", value}) => (
    <label className="kebab-label" htmlFor={name}>{label}
        <input className={`kebab-input ${inputClassOverride}`} id={id} name={name} required={required} type={type} value={value} onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e.currentTarget.value)}/>
    </label>
);