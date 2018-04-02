import * as React from "react";
import { Shop } from "../models";
import { IDishList } from "./dish-interfaces";
import { DishElement } from "./DishElement";

export const DishList : React.StatelessComponent<IDishList> = ({createNewDish, dishes, selectDish}) => (
    <div className="container" >
        <h1>Retter</h1>
        <button className="kebab-button" onClick={() => createNewDish()}>Ny rett?</button>
        {
            dishes.map(dish => (
                <DishElement dish={dish} selectDish={selectDish} />
            ))
        }
    </div>
);