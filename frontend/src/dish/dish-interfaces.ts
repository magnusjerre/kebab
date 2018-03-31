import { Dish } from "../models";

interface ISelectDish {
    (dishId: string):void
}

export interface IDishElement {
    dish: Dish
    selectDish: ISelectDish
}

export interface IDishList {
    dishes: Dish[]
    selectDish: ISelectDish
}