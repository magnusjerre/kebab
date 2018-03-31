import * as React from "react";
import { IEnumElement } from "./purchase-interface";
import { strengthToStringName } from "../utils";

export const EnumElementRadio: React.StatelessComponent<IEnumElement> = ({enumToString, id, name, select, selected, value}) => (
    <div className="enum-div">
        <input type="radio" className="hidden-input" id={id} name={name} value={value} checked={selected} onChange={() => select(value)}/>
        <label htmlFor={id} className={`enum-element ${selected ? "enum-element-selected" : ""}`}>
            <span>{enumToString(value)}</span>
        </label>
    </div>
);