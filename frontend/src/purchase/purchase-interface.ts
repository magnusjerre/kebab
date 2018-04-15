import { Dish, StrengthEnum, PriceSizeFrontend } from "../models";

export interface IPurchase {
    cancel?: VoidFunction
    dish: Dish
    maxGrade: number
    onRegistered: VoidFunction
}

export interface IStrengthElement {
    select: IStrengthSelect
    selected: boolean
    strength: StrengthEnum
}

export interface IStrengthComponent {
    select: IStrengthSelect
    selected: StrengthEnum
}

interface IStrengthSelect {
    (strength: StrengthEnum):void
}

interface IEnumToString {
    (e: any):string
}

export interface IEnumElement {
    enumToString: IEnumToString
    select: IEnumSelect
    selected: boolean
    value: any
    id?: string
    name?: string
}

interface IEnumSelect {
    (value: any):void
}

export interface IEnumListComponent {
    enumToString: IEnumToString
    idBase: string
    select: IEnumSelect
    selected: any
    title: string
    values: any[]
}

interface IPriceSizeSelect {
    (value: PriceSizeFrontend):void
}

export interface IPriceSize {
    id: string
    name: string
    select: IPriceSizeSelect
    isSelected: boolean
    value: PriceSizeFrontend
}

export interface IPriceSizeList {
    idBase: string
    select: IPriceSizeSelect
    selected: PriceSizeFrontend
    values: PriceSizeFrontend[]
}