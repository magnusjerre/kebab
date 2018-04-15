import * as React from "react";
import { Shop } from "./../models";
import { IDishElement } from "./dish-interfaces";

export const DishElement : React.StatelessComponent<IDishElement> = ({dish, isLoggedIn, selectDish}) => (
    <button className="list-element" onClick={() => {selectDish(dish.id)}}>
        <h2>{dish.name}</h2>
        <span>{dish.priceSizes.map(ps => `${ps.size.name} - ${ps.price} kr\t`)}</span>
    </button>
);