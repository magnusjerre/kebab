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
    XSMALL, SMALL, MEDIUM, LARGE, XLARGE, SINGLE_SIZE
}

export interface PurchasePost {
    dishId: string
    purchaseInfo: PurchaseInfo
    ratingInfo: RatingInfo
}

export interface PurchaseInfo {
    price: number
    size: SizeEnum
    strength: StrengthEnum
}

export interface RatingInfo {
    rating: Grade
    strength: StrengthEnum
    deliveryTime: DeliveryTime
    comment: String
}

export interface Grade {
    value: number
    max: number
}

export enum StrengthEnum {
    MILD, MEDIUM, HOT, INTENSE
}

export enum DeliveryTime {
    SLOW, OK, FAST
}
