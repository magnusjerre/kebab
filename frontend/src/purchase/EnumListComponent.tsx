import * as React from "react";
import { IEnumListComponent } from "./purchase-interface";
import { EnumElementRadio } from "./EnumElement";

export const EnumListComponent : React.StatelessComponent<IEnumListComponent> = ({enumToString, idBase, select, selected, title = "", values}) => { 
    var selectedIndex = -1;
    values.forEach((val, pos) => {if (selected == val) selectedIndex = pos;});
    return (
        <div className="enum-list-container">
            {
                title != "" && <label htmlFor={idBase + selectedIndex} className="kebab-label">{title}</label>
            }
            <div className="enum-list">
                {
                    values.map((val, pos) => 
                        <EnumElementRadio enumToString={enumToString} id={idBase + pos} name={idBase} select={select} selected={selected == val} value={val}/>
                    )
                }
            </div>
        </div>
    );
}