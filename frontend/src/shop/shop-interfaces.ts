import { Shop } from "../models";

interface ISelectShop {
    (shopId: string): void
}

export interface IShopElement {
    selectShop: ISelectShop
    shop: Shop
}

export interface IShopList {
    selectShop: ISelectShop
    shops: Shop[]
}