import * as React from "react";
import { Dish, Size, PriceSizeFrontend, SizeEnum } from "./models";
import { sizeToString, stringToBoolean, getCookie, CSRF_COOKIE, convertFrontendDishToBackendDish, fetchCsrf } from "./utils";

interface IPriceSize {
    priceSizes: PriceSizeFrontend[]
    arrPos: number
    change: (arrPos: number, price: number, chekced: boolean | any) => void
}

const PriceSizeComponent : React.StatelessComponent<IPriceSize> = ({priceSizes, arrPos, change}) => {
    const ps = priceSizes[arrPos];
    const priceId = `price-${ps.size}`;
    const priceCheckboxId = `price-${ps.size}-checkbox`;
    return (
    <div className="price-size-component">
        <label htmlFor={priceId}>Pris <input type="number" id={priceId} name={priceId} value={ps.price} onChange={(e: React.FormEvent<HTMLInputElement>) => change(arrPos, parseInt(e.currentTarget.value), ps.checked)} /></label>
        <span>{sizeToString(ps.size.size)}</span>
        <input type="checkbox" id={priceCheckboxId} name={priceCheckboxId} value={priceCheckboxId} checked={ps.checked} onChange={(e: React.FormEvent<HTMLInputElement>) => change(arrPos, ps.price, !ps.checked) } />
    </div>
)};

export class DishEdit extends React.Component<{}, Dish> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: "",
            priceSizes: [
                {
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
                }
            ],
            shopId: "",
            vegetarian: true
        };

        this.setPriceSize = this.setPriceSize.bind(this);
    }

    setPriceSize(arrPos: number, price: number, checked: boolean) {
        var priceSizes = [...this.state.priceSizes];
        var priceSize = priceSizes[arrPos];
        priceSize.price = price;
        priceSize.checked = checked;
        this.setState({
            ...this.state,
            priceSizes: priceSizes
        });
    }

    render() {
        return (
            <div className="dish">
                <label htmlFor="name">Navn <input type="text" id="name" name="name" value={this.state.name} onChange={(e: React.FormEvent<HTMLInputElement>) => this.setState({
                    ...this.state,
                    name: e.currentTarget.value
                })}/></label>

                <label htmlFor="shopId">Shop ID <input type="text" id="shopId" name="shopId" value={this.state.shopId} onChange={(e: React.FormEvent<HTMLInputElement>) => this.setState({
                    ...this.state,
                    shopId: e.currentTarget.value
                })}/></label>

                <div>
                    <p>Vegetar?</p>
                    <label htmlFor="vegetarian">Ja <input type="radio" id="vegetarian" name="vegetarian" value="ja" checked={this.state.vegetarian === true} onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        this.setState({
                            ...this.state,
                            vegetarian: true
                        });
                    }}/></label>
                    <label htmlFor="vegetarian">Nei <input type="radio" id="vegetarian" name="vegetarian" value="nei" checked={this.state.vegetarian === false} onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        this.setState({
                            ...this.state,
                            vegetarian: false
                        });
                    }}/></label>
                </div>

                <label>Prices and sizes</label>
                <PriceSizeComponent priceSizes={this.state.priceSizes} arrPos={0} change={this.setPriceSize} />
                <PriceSizeComponent priceSizes={this.state.priceSizes} arrPos={1} change={this.setPriceSize} />
                <PriceSizeComponent priceSizes={this.state.priceSizes} arrPos={2} change={this.setPriceSize} />

                <button onClick={() => {
                    fetchCsrf().then(() =>
                    fetch("/api/closed/dish", {
                        method: "POST",
                        credentials: "same-origin",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": getCookie(CSRF_COOKIE)
                        },
                        body: JSON.stringify(convertFrontendDishToBackendDish(this.state))
                    }));
                }}>Lagre rett</button>

            </div>
        );
    }
}

