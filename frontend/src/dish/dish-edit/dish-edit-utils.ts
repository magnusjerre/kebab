import { SizeEnum, PriceSizeFrontend, Dish } from "../../models";
import { getCookie, CSRF_COOKIE, fetchCsrf, copyArray } from "../../utils";
import { IDishEdit } from "../dish-interfaces";

export const defaultState = (dish: Dish, shopId: string) : IDishEdit => {
    if (dish == null) {
        return {
            id: null,
            name: "",
            hasOnlyOneSize: true,
            priceSizes: createSinglePriceSize(),
            shopId: shopId,
            vegetarian: false
        }
    }
    return {
        id: dish.id,
        name: dish.name,
        hasOnlyOneSize: dish.priceSizes.length == 1,
        priceSizes: copyArray(dish.priceSizes),
        shopId: dish.id,
        vegetarian: dish.vegetarian
    };
}

export const createMultiplePriceSizes = () : PriceSizeFrontend[] => [{
    price: 0,
    size: {
        size: SizeEnum.SMALL,
        name: "Liten"
    },
    checked: true
},
{
    price: 0,
    size: {
        size: SizeEnum.MEDIUM,
        name: "Stor"
    },
    checked: true
},
{
    price: 0,
    size: {
        size: SizeEnum.LARGE,
        name: "King kong"
    },
    checked: false
}];

export const createSinglePriceSize = () : PriceSizeFrontend[] => [{
    price: 0,
    size: {
        size: SizeEnum.SINGLE_SIZE,
        name: "Vanlig"
    },
    checked: true
}];
