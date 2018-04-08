import * as React from "react";
import { Shop } from "../models";
import { IDishList } from "./dish-interfaces";
import { DishElement } from "./DishElement";

export const DishList : React.StatelessComponent<IDishList> = ({createNewDish, dishes, isLoggedIn, selectDish}) => (
    <div className="container" >
        { isLoggedIn && <button className="kebab-button" onClick={() => createNewDish()}>Ny rett?</button> }
        {
            dishes.length == 0 && <p>Det er ikke registrert en eneste babb!</p>
        }
        {
            dishes.map(dish => (
                <DishElement dish={dish} selectDish={selectDish} />
            ))
        }
    </div>
);