import * as React from "react";
import { Shop } from "./../models";
import { IShopElement } from "./shop-interfaces";

export const ShopElement : React.StatelessComponent<IShopElement> = ({selectShop, shop}) => (
    <button className="list-element" onClick={() => selectShop(shop.id)}>
        <h2>{shop.name}</h2>
        <p>{shop.address}</p>
    </button>
);