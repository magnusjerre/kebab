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

function login(username: string, password: string, csrf: string) {
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        credentials: 'same-origin',
        body: `username=${username}&password=${password}&_csrf=${csrf}`
    })
    .then((response: Response) => {
        handleCsrf(response);
        return response.body.getReader().read();
    });
}

function logout(csrf: string) {
    fetch("/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `_csrf=${csrf}`
    })
    .then((response: Response) => {
        handleCsrf(response);
    });
}

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
        };

        this.selectDish = this.selectDish.bind(this);
        this.selectShop = this.selectShop.bind(this);
        this.setCreateNewShop = this.setCreateNewShop.bind(this);
        this.setCreateNewDish = this.setCreateNewDish.bind(this);
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

    render() {
        var shopId = this.state.chosenShopId;
        var dishList = this.state.dishes.filter(dish => dish.shopId == shopId);
        return (
            <div>
                <LoginHeader />
                <ShopList createNewShop={() => this.setCreateNewShop(true)} shops={this.state.shops} selectShop={this.selectShop}/>
                {
                    this.state.chosenShopId &&
                    <DishList createNewDish={() => this.setCreateNewDish(true)} dishes={dishList} selectDish={this.selectDish} />
                }
                <p>hello, this is react!</p>
                <img src={pluss}/>
                <button onClick={() => {
                    fetch("/api/open/names")
                    .then((response: Response) => response.json())
                    .then(json => console.log(json));
                }} >Hent navn</button>

                <form id="myForm" action="Login">
                    <div><label htmlFor="username">Username:</label><input type="text" id="username" name="username" /></div>
                    <div><label htmlFor="email">Email:</label><input type="text" id="email" name="email" /></div>
                    <div><label htmlFor="password">Password:</label><input type="password" id="password" name="password" /></div>
                </form>

                <button onClick={() => {
                    fetch("/", {credentials: "same-origin"}).then((response: Response) => {
                        handleCsrf(response);
                    })
                }}>Fetch CSRF</button>

                <button onClick={() => {
                    var csrf = getCookie(CSRF_COOKIE);
                    var password = (document.getElementById("password") as HTMLInputElement).value;
                    var username = (document.getElementById("username") as HTMLInputElement).value;
                    fetchCsrf().then((tcsrf: string) => {
                        login(username, password, tcsrf);
                    });
                }}>Login button</button>

                <button onClick={() => {
                    var csrf = getCookie(CSRF_COOKIE);
                    var password = (document.getElementById("password") as HTMLInputElement).value;
                    var username = (document.getElementById("username") as HTMLInputElement).value;
                    var email = (document.getElementById("email") as HTMLInputElement).value;
                    if (password && username && email) {
                        fetch("/api/open/user", {
                            method: "POST",
                            credentials: "same-origin",
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': csrf,
                            },
                            body: JSON.stringify({
                                "_id": null,
                                "username": username,
                                "password": password
                            })
                        })
                        .then((response: Response) => {
                            handleCsrf(response);
                        });
                    } else {
                        console.log("Mangler input info for å kunne opprette bruker");
                    }
                }}>Opprett bruker</button>

                <button onClick={() => {
                    //Noe som feiler om man prøver å logge ut rett etter login, henter derfor ny token
                    fetchCsrf().then((ncsrf: string) => {
                        logout(ncsrf);
                    });
                }}>Log out</button>

                <div></div>
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

                <label htmlFor="shopId">ShopId:</label><input type="text" id="shopId" name="shopId" />
                <button onClick={() => {
                    const shopId = (document.getElementById("shopId") as HTMLInputElement).value;
                    fetch(`/api/open/shop/${shopId}/dish`)
                    .then((response: Response) => response.json())
                    .then(json => console.log("dishes", json));
                }}>Hent retter for sjappe</button>

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