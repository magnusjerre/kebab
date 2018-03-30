export interface Shop {
    id?: string
    name: string
    address: string
}

export interface Dish {
    id?: string
    name: string
    priceSizes: PriceSizeFrontend[]
    shopId: string
    vegetarian: boolean
}

export interface DishBackend {
    id?: string
    name: string
    priceSizes: PriceSizeBackend[]
    shopId: string
    vegetarian: boolean
}

export interface PriceSizeBackend {
    price: number
    size: Size
}

export interface PriceSizeFrontend extends PriceSizeBackend {
    checked: boolean
}

export interface Size {
    size: SizeEnum
    name: string
}

export enum SizeEnum {
    XSMALL, SMALL, MEDIUM, LARGE, XLARGE
}