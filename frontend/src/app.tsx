import * as React from "react";
import { ShopEdit } from "./ShopEdit";
import { DishEdit } from "./DishEdit";
import { PurchaseRegistration } from "./PurchaseRegistration";
import { handleCsrf, fetchCsrf, getCookie, CSRF_COOKIE } from "./utils";
import { IAppState, Shop, Dish } from "./models";

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
            chosenDishId: ""
        };
    }

    componentWillMount() {
        fetchCsrf().then((csrf: string) => {
            fetch("/api/open/shop").then((response: Response) => response.json()).then((shops: Shop[]) => {
                var chosenShopId = (shops.length > 0) ? shops[0].id : "";
                this.setState({
                    ...this.state,
                    shops,
                    chosenShopId
                })
            });
            fetch("/api/open/dish").then((response: Response) => response.json()).then((dishes: Dish[]) => {
                var chosenDishId = (dishes.length > 0) ? dishes[0].id : "";
                this.setState({
                    ...this.state,
                    dishes,
                    chosenDishId
                })
            });
        });
    }

    render() {
        return (
            <div>
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

                <ShopEdit />
                <DishEdit />
                {
                    this.state.chosenDishId != "" && <PurchaseRegistration dish={this.state.dishes.filter(dish => dish.id === this.state.chosenDishId)[0]} maxGrade={5} />
                }
                {/* <PurchaseRegistration dish={null} maxGrade={5} /> */}
            </div>
        );
    }
}