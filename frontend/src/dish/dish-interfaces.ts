import { Dish, PriceSizeFrontend } from "../models";

interface ISelectDish {
    (dishId: string):void
}

export interface IDishElement {
    dish: Dish
    selectDish: ISelectDish
}

export interface IDishList {
    createNewDish: VoidFunction
    dishes: Dish[]
    isLoggedIn: boolean
    selectDish: ISelectDish
}

export interface IDishEdit {
    id?: string
    name: string
    hasOnlyOneSize: boolean
    priceSizes: PriceSizeFrontend[]
    shopId: string
    vegetarian: boolean
}

export interface IDishEditProps {
    dish?: Dish
    shopId: string
    done: VoidFunction
}

export interface IPriceSizeComponent {
    hasOnlyOneSize: boolean
    priceSizes: PriceSizeFrontend[]
    setHasOnlyOneSize: (val: boolean) => void
    setPrice: ISetPrice
}

interface ISetPrice {
    (pos: number, price: number, checked: boolean):void
}

export interface IPriceSizeComponentElement {
    hasOnlyOneSize: boolean
    pos: number
    priceSize: PriceSizeFrontend
    setPrice: ISetPrice
}
