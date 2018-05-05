import * as React from "react";

export interface IInputProps {
    id: string
    inputClassOverride?: string
    label: string
    name: string
    onChange: (value: any) => void
    required?: boolean
    value: any
}

export const TextArea : React.StatelessComponent<IInputProps> = ({id, inputClassOverride = "", label, name, onChange, required = false, value}) => (
    <label className="kebab-label" htmlFor={name}>{label}
        <textarea className={`kebab-textarea ${inputClassOverride}`} id={id} name={name} required={required} value={value} onChange={(e: React.FormEvent<HTMLTextAreaElement>) => onChange(e.currentTarget.value)}></textarea>
    </label>
);