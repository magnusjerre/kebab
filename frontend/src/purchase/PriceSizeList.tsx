import * as React from "react";
import { IPriceSizeList } from "./purchase-interface";
import { PriceSize } from "./PriceSize";

export const PriceSizeList : React.StatelessComponent<IPriceSizeList> = ({idBase, select, selected, values}) => (
    <div>
        <div className="price-sizes">
                {
                    values.map((val, pos) => 
                        <PriceSize id={idBase + pos} name={idBase} select={select} isSelected={selected == val} value={val} />
                    )
                }
            </div>
    </div>
);