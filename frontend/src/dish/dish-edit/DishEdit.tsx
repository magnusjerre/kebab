import * as React from "react";
import { Dish, Size, PriceSizeFrontend, SizeEnum } from "./../../models";
import { sizeToString, stringToBoolean, getCookie, CSRF_COOKIE, convertFrontendDishToBackendDish, fetchCsrf, post, copyArray } from "./../../utils";
import { IDishEdit, IDishEditProps } from "./../dish-interfaces";
import { PriceSizeComponent } from "./PriceSizeCompnent";
import { EnumListComponent } from "../../purchase/EnumListComponent";
import { createSinglePriceSize, createMultiplePriceSizes, defaultState } from "./dish-edit-utils";

export class DishEdit extends React.Component<IDishEditProps, IDishEdit> {
    constructor(props: IDishEditProps) {
        super(props);
        this.state = defaultState(props.dish, props.shopId);

        this.setHasOnlyOneSize = this.setHasOnlyOneSize.bind(this);
        this.setName = this.setName.bind(this);
        this.setPriceSize = this.setPriceSize.bind(this);
        this.setVegetarian = this.setVegetarian.bind(this);
    }

    setHasOnlyOneSize(val: boolean) {
        var priceSizes = [...this.state.priceSizes];
        if (val != this.state.hasOnlyOneSize) {
            if (val) {
                priceSizes = createSinglePriceSize();
            } else {
                priceSizes = createMultiplePriceSizes();
            }
        }
        this.setState({
            ...this.state,
            hasOnlyOneSize: val,
            priceSizes: priceSizes
        });
    }

    setName(event: React.FormEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            name: event.currentTarget.value
        });
    }

    setPriceSize(arrPos: number, price: number, checked: boolean) {
        var priceSizes = copyArray(this.state.priceSizes);
        var priceSize = priceSizes[arrPos];
        priceSize.price = price;
        priceSize.checked = checked;
        this.setState({
            ...this.state,
            priceSizes: priceSizes
        });
    }

    setVegetarian(val: boolean) {
        this.setState({
            ...this.state,
            vegetarian: val
        });
    }

    render() {
        return (
            <div className="dish">
                <h2>Ny rett</h2>
                <label htmlFor="name">Navn <input type="text" required={true} id="name" name="name" value={this.state.name} onChange={this.setName}/></label>

                <EnumListComponent enumToString={(val: any) => val ? "Ja" : "Nei"} idBase="vegetarian" select={this.setVegetarian} title="Vegetar?" values={[true, false]} selected={this.state.vegetarian}/>

                <PriceSizeComponent hasOnlyOneSize={this.state.hasOnlyOneSize} priceSizes={this.state.priceSizes} setHasOnlyOneSize={this.setHasOnlyOneSize} setPrice={this.setPriceSize}/>

                <button className="kebab-button" onClick={() => post("/api/closed/dish", JSON.stringify(convertFrontendDishToBackendDish(this.state)), this.props.done) }>Lagre rett</button>
            </div>
        );
    }
}

