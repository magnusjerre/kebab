import * as React from "react";
import { ShopEdit } from "./shop/registration/ShopEdit";
import { DishEdit } from "./dish/dish-edit/DishEdit";
import { PurchaseRegistration } from "./purchase/PurchaseRegistration";
import { handleCsrf, fetchCsrf, getCookie, CSRF_COOKIE, fetchShops, fetchDishes } from "./utils";
import { Shop, Dish } from "./models";
import { ShopList } from "./shop/ShopList";
import { DishList } from "./dish/DishList";
import { LoginHeader } from "./user/LoginHeader";

let pluss = require("../images/check.png")
require("../scss/styles.scss")

declare function require(name: string): any

enum AppContentView {
    SHOPS, SHOP_EDIT, DISHES, DISH_EDIT, PURCHASE
}

interface IAppState {
    shops: Shop[]
    dishes: Dish[]
    chosenShopId: string
    chosenDishId: string
    contentView: AppContentView[]
    isLoggedIn: boolean
}

export class App extends React.Component<any, IAppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            shops: [],
            dishes: [],
            chosenShopId: "",
            chosenDishId: "",
            contentView: [AppContentView.SHOPS],
            isLoggedIn: false
        };

        this.getTitle = this.getTitle.bind(this);
        this.goBack = this.goBack.bind(this);
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
        const contentViewHistory = [...this.state.contentView];
        contentViewHistory.unshift(AppContentView.DISHES);
        this.setState({
            ...this.state,
            chosenDishId: "",
            chosenShopId: id,
            contentView: contentViewHistory
        });
    }

    selectDish(id: string) {
        const contentViewHistory = [...this.state.contentView];
        contentViewHistory.unshift(AppContentView.PURCHASE);
        this.setState({
            ...this.state,
            chosenDishId: id,
            contentView: contentViewHistory
        });
    }

    setCreateNewShop(value: boolean) {
        const contentViewHistory = [...this.state.contentView];
        contentViewHistory.unshift(AppContentView.SHOP_EDIT);
        this.setState({
            ...this.state,
            contentView: contentViewHistory
        });
    }

    setCreateNewDish(value: boolean) {
        const contentViewHistory = [...this.state.contentView];
        contentViewHistory.unshift(AppContentView.DISH_EDIT);
        this.setState({
            ...this.state,
            contentView: contentViewHistory
        });
    }

    setLoggedInState = (newState: boolean) => {
        this.setState({
            ...this.state,
            isLoggedIn: newState
        });
    }

    goBack = () => {
        const contentViewHistory = [...this.state.contentView];
        if (contentViewHistory.length == 1) {
            console.warn("At initial state, can't go back further");
            return;
        }

        const oldView = contentViewHistory.shift();
        var selectedDishId = this.state.chosenDishId;
        if (oldView == AppContentView.PURCHASE) {
            selectedDishId = "";
        }
        var selectedShopId = this.state.chosenShopId;
        if (oldView == AppContentView.DISHES) {
            selectedShopId = "";
        }

        this.setState({
            ...this.state,
            contentView: contentViewHistory,
            chosenDishId: selectedDishId,
            chosenShopId: selectedShopId
        })
    }

    getTitle() {
        switch(this.state.contentView[0]) {
            case AppContentView.DISHES: return "Retter";
            case AppContentView.DISH_EDIT: return "Ny rett";
            case AppContentView.PURCHASE: return "Kjøp";
            case AppContentView.SHOP_EDIT: return "Ny sjappe";
            default: return "Sjapper";
        }
    }

    render() {
        var shopId = this.state.chosenShopId;
        var dishList = this.state.dishes.filter(dish => dish.shopId == shopId);
        var view = this.state.contentView[0];
        var showBackButton = this.state.contentView.length > 1;
        return (
            <div className="app">
                <LoginHeader loggedInState={this.setLoggedInState}/>
                <div className="sub-header">
                    {
                        showBackButton && <button className="kebab-button back-button" onClick={this.goBack}>Tilbake</button>
                    }
                    <div className="sub-sub-header"><h1>{this.getTitle()}</h1></div>
                </div>
                {
                    view == AppContentView.SHOPS && <ShopList createNewShop={() => this.setCreateNewShop(true)} isLoggedIn={this.state.isLoggedIn} shops={this.state.shops} selectShop={this.selectShop}/>
                }
                {
                    view == AppContentView.SHOP_EDIT && <ShopEdit id={null} name="" address="" done={() => { this.setCreateNewShop(false); fetchShops(this); }}/>
                }
                {
                    view == AppContentView.DISHES && <DishList createNewDish={() => this.setCreateNewDish(true)} dishes={dishList} isLoggedIn={this.state.isLoggedIn} selectDish={this.selectDish} />
                }
                {
                    view == AppContentView.DISH_EDIT && <DishEdit dish={null} shopId={this.state.chosenShopId} done={() => { this.setCreateNewDish(false); fetchDishes(this); }}/>
                }
                {
                    view == AppContentView.PURCHASE && <PurchaseRegistration dish={this.state.dishes.filter(dish => dish.id === this.state.chosenDishId)[0]} maxGrade={5} />
                }
            </div>
        );
    }
}