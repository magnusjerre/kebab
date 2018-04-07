import * as React from "react";
import { Shop } from "../models";
import { IShopList } from "./shop-interfaces";
import { ShopElement } from "./ShopElement";

export const ShopList : React.StatelessComponent<IShopList> = ({createNewShop, isLoggedIn, selectShop, shops}) => (
    <div className="container" >
        <h1>Kebabsjapper</h1>
        { isLoggedIn && <button className="kebab-button" onClick={() => createNewShop()}>Ny butikk?</button> }
        {
            shops.map(shop => (
                <ShopElement shop={shop} selectShop={selectShop} />
            ))
        }
    </div>
);