import * as React from "react";
import { IPriceSize } from "./purchase-interface";

export const PriceSize : React.StatelessComponent<IPriceSize> = ({id, name, select, isSelected, value}) => (
    <div className="enum-div">
        <input type="radio" className="hidden-input" id={id} name={name} value={value.size.size + value.price} checked={isSelected} onChange={() => select(value)} />
        <label htmlFor={id} className={`enum-element ${isSelected ? "enum-element-selected" : ""}`} >
            <span>{value.size.name}, {value.price} kr</span>
        </label>
    </div>
);