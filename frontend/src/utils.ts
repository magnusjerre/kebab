import { Size, SizeEnum, Dish, DishBackend, PriceSizeBackend,PriceSizeFrontend } from "./models";

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

export function stringToBoolean(str: string) : boolean {
    if (str === "true" || str === "TRUE" || str === "true")
        return true;
    return false;
}

export function convertFrontendDishToBackendDish(frontendDish: Dish) : DishBackend {
    var output = <DishBackend>{
        id: frontendDish.id,
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