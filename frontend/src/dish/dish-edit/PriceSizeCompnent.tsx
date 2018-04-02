import * as React from "react";
import { IPriceSizeComponent, IPriceSizeComponentElement } from "../dish-interfaces";
import { EnumListComponent } from "../../purchase/EnumListComponent";

const PriceSizeComponentElement : React.StatelessComponent<IPriceSizeComponentElement> = ({hasOnlyOneSize, pos, priceSize,  setPrice}) => (
    <div className="price-size-element">
        {
            !hasOnlyOneSize && 
            <input type="checkbox" id={`ps-size-${pos}`} value={priceSize.size.size} checked={priceSize.checked} onChange={() => setPrice(pos, priceSize.price, !priceSize.checked)}/>
        }
        <span>{priceSize.size.name}</span>
        <label htmlFor={`ps-price-${pos}`}>Pris</label>
        <input type="number" className="small-input" id={`ps-price-${pos}`} value={priceSize.price} onChange={(e: React.FormEvent<HTMLInputElement>) => setPrice(pos, parseInt(e.currentTarget.value), priceSize.checked)} />
        <span className="currency"> kr</span>
    </div>
);

export const PriceSizeComponent : React.StatelessComponent<IPriceSizeComponent> = ({hasOnlyOneSize, priceSizes, setHasOnlyOneSize, setPrice}) => {
    
    return (
        <div>
            <EnumListComponent enumToString={(val: any) => val ? "Ja" : "Nei"} idBase="has-only-one-size" select={setHasOnlyOneSize} title="Bare én størrelse?" values={[true, false]} selected={hasOnlyOneSize}/>
            {
                priceSizes.map((ps, pos) => <PriceSizeComponentElement hasOnlyOneSize={hasOnlyOneSize} pos={pos} priceSize={ps} setPrice={setPrice}/>)
            }
        </div>
    );
}