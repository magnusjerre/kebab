import * as React from "react";
import { ShopEdit } from "./shop/registration/ShopEdit";
import { DishEdit } from "./dish/dish-edit/DishEdit";
import { PurchaseRegistration } from "./purchase/PurchaseRegistration";
import { handleCsrf, fetchCsrf, getCookie, CSRF_COOKIE, fetchShops, fetchDishes } from "./utils";
import { IAppState, Shop, Dish } from "./models";
import { ShopList } from "./shop/ShopList";
import { DishList } from "./dish/DishList";
import { LoginHeader } from "./user/LoginHeader";

let pluss = require("../images/check.png")
require("../scss/styles.scss")

declare function require(name: string): any

export class App extends React.Component<any, IAppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            shops: [],
            dishes: [],
            chosenShopId: "",
            chosenDishId: "",
            createNewShop: false,
            createNewDish: false,
            isLoggedIn: false
        };

        this.selectDish = this.selectDish.bind(this);
        this.selectShop = this.selectShop.bind(this);
        this.setCreateNewShop = this.setCreateNewShop.bind(this);
        this.setCreateNewDish = this.setCreateNewDish.bind(this);
        this.setLoggedInState = this.setLoggedInState.bind(this);
    }

    componentWillMount() {
        fetchCsrf().then((csrf: string) => {
            fetchShops(this);
            fetchDishes(this);
        });
    }

    selectShop(id: string) {
        this.setState({
            ...this.state,
            chosenDishId: "",
            chosenShopId: id
        });
    }

    selectDish(id: string) {
        this.setState({
            ...this.state,
            chosenDishId: id
        });
    }

    setCreateNewShop(value: boolean) {
        this.setState({
            ...this.state,
            createNewShop: value
        });
    }

    setCreateNewDish(value: boolean) {
        this.setState({
            ...this.state,
            createNewDish: value
        });
    }

    setLoggedInState = (newState: boolean) => {
        this.setState({
            ...this.state,
            isLoggedIn: newState
        });
    }

    render() {
        var shopId = this.state.chosenShopId;
        var dishList = this.state.dishes.filter(dish => dish.shopId == shopId);
        return (
            <div className="app">
                <LoginHeader loggedInState={this.setLoggedInState}/>
                <ShopList createNewShop={() => this.setCreateNewShop(true)} isLoggedIn={this.state.isLoggedIn} shops={this.state.shops} selectShop={this.selectShop}/>
                {
                    this.state.chosenShopId &&
                    <DishList createNewDish={() => this.setCreateNewDish(true)} dishes={dishList} isLoggedIn={this.state.isLoggedIn} selectDish={this.selectDish} />
                }
                <img src={pluss}/>

                <div>
                <button onClick={() => {
                    fetch("/", {credentials: "same-origin"}).then((response: Response) => {
                        handleCsrf(response);
                    })
                }}>Fetch CSRF</button>
                    <button onClick={() => {
                        fetch("/api/closed/surnames", {
                            method: "GET",
                            credentials: "same-origin"
                        })
                        .then((response: Response) => {
                            handleCsrf(response);
                            return response.json();
                        })
                        .then(json => console.log(json))
                    }}>hent sikret data</button>

                    <button onClick={() => {
                        fetch("/api/open/names", {
                            method: "GET",
                            credentials: "same-origin"
                        })
                        .then((response: Response) => {
                            handleCsrf(response);
                            return response.json();
                        })
                        .then(json => console.log(json))
                    }}>hent åpen data</button>
                </div>

                {
                    this.state.createNewDish && this.state.chosenShopId != "" && <DishEdit dish={null} shopId={this.state.chosenShopId} done={() => {
                        this.setCreateNewDish(false);
                        fetchDishes(this);
                    }}/>
                }

                {
                    this.state.chosenDishId != "" && <PurchaseRegistration dish={this.state.dishes.filter(dish => dish.id === this.state.chosenDishId)[0]} maxGrade={5} />
                }
                {
                    this.state.createNewShop &&
                    <ShopEdit id={null} name="" address="" done={() => {
                        this.setCreateNewShop(false);
                        fetchShops(this);
                    }}/>
                }
            </div>
        );
    }
}