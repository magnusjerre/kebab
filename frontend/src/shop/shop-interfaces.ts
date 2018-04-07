import { Shop } from "../models";

interface ISelectShop {
    (shopId: string): void
}

export interface IShopElement {
    selectShop: ISelectShop
    shop: Shop
}

export interface IShopList {
    createNewShop: VoidFunction
    isLoggedIn: boolean
    selectShop: ISelectShop
    shops: Shop[]
}

export interface IShopRegistration {
    id?: string
    name: string
    address: string
}

export interface IShopEditProps extends IShopRegistration {
    done: VoidFunction
}