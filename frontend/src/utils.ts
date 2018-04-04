import { Size, SizeEnum, Dish, DishBackend, PriceSizeBackend,PriceSizeFrontend, StrengthEnum, DeliveryTime, Shop } from "./models";

export const CSRF_COOKIE = "csrf";
export const COOKE_LIFETIME = 365;

export function getCookie(cname : any) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function setCookie(cname: string, cvalue: any, exdays: number) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function handleCsrf(response: Response) : string {
    const newCsrf = response.headers.get("X-CSRF-TOKEN") as string;
    const exCsrf = getCookie(CSRF_COOKIE);
    if (newCsrf == null || newCsrf == exCsrf) {
        console.log(`newCsrf is null or same as existing: ${newCsrf}`);
        return exCsrf;
    }

    setCookie(CSRF_COOKIE, newCsrf, COOKE_LIFETIME);
    console.log(`setting new csrf: ${newCsrf}`);
    return newCsrf;
}

export function sizeToString(size: SizeEnum) : string {
    switch(size) {
        case SizeEnum.XSMALL: return "Mini";
        case SizeEnum.SMALL: return "Liten";
        case SizeEnum.MEDIUM: return "Medium";
        case SizeEnum.LARGE: return "Stor";
        case SizeEnum.XLARGE: return "King Kong";
        default: {
            return "Medium";
        }
    }
}

export function strengthToStringName(strength: StrengthEnum) : string {
    switch(strength) {
        case StrengthEnum.MILD: return "Mild";
        case StrengthEnum.MEDIUM: return "Medium";
        case StrengthEnum.HOT: return "Hot";
        default: return "Intense";
    }
}

export function deliveryTimeToStringName(deliveryTime: DeliveryTime) : string {
    switch(deliveryTime) {
        case DeliveryTime.SLOW: return "Treig";
        case DeliveryTime.OK: return "Forventet";
        default: return "Rask";
    }
}

export function stringToBoolean(str: string) : boolean {
    if (str === "true" || str === "TRUE" || str === "true")
        return true;
    return false;
}

export function convertFrontendDishToBackendDish(frontendDish: Dish) : DishBackend {
    const id = frontendDish.id ? frontendDish.id : null;
    var output = <DishBackend>{
        id: id,
        name: frontendDish.name,
        shopId: frontendDish.shopId,
        vegetarian: frontendDish.vegetarian,
        priceSizes: [] as PriceSizeBackend[]
    };

    for (var i = 0; i < frontendDish.priceSizes.length; i++) {
        var ps : PriceSizeFrontend = frontendDish.priceSizes[i];
        if (ps.checked) {
            output.priceSizes.push({
                price: ps.price,
                size: ps.size
            });
        }
    }
    return output;
}

export function fetchCsrf() {
    return fetch("/", {credentials: "same-origin"}).then((response: Response) => {
        var csrf = handleCsrf(response);
        return new Promise((resolve: (csrf: string) => void, reject: any) => {
            resolve(csrf);
        });
    });
}

export function fetchShops(compRef: any) {
    fetch("/api/open/shop").then((response: Response) => response.json()).then((shops: Shop[]) => {
        compRef.setState({
            ...compRef.state,
            shops,
            chosenShopId: "",
            chosenDishId: ""
        })
    });
}

export function fetchDishes(compRef: any) {
    fetch("/api/open/dish").then((response: Response) => response.json()).then((dishes: Dish[]) => {
        compRef.setState({
            ...compRef.state,
            dishes,
            chosenDishId: ""
        })
    });
}

export function post(url: string, data: any, done: VoidFunction = () => {}) {
    fetchCsrf().then(() =>
        fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": getCookie(CSRF_COOKIE)
            },
            body: JSON.stringify(data)
        }).then((response: Response) => {done()})
    );
}

export function copyArray(arr: any[]) : any[] {
    var output = [];
    for (var i = 0; i < arr.length; i++) {
        output.push({
            ...arr[i]
        });
    }
    return output;
}

export function login(username: string, password: string, csrf: string) {
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