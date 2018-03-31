import * as React from "react";
import { IEnumListComponent } from "./purchase-interface";
import { EnumElementRadio } from "./EnumElement";

export const EnumListComponent : React.StatelessComponent<IEnumListComponent> = ({enumToString, idBase, select, selected, title, values}) => { 
    return (
        <div>
            <h3>{title}</h3>
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