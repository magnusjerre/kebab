import * as React from "react";

let pluss = require("../images/check.png")
require("../scss/styles.scss")

declare function require(name: string): any

const CSRF_COOKIE = "csrf";
const COOKE_LIFETIME = 365;

function getCookie(cname : any) {
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

function setCookie(cname: string, cvalue: any, exdays: number) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function handleCsrf(response: Response) : string {
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

function fetchCsrf() {
    return fetch("/", {credentials: "same-origin"}).then((response: Response) => {
        var csrf = handleCsrf(response);
        return new Promise((resolve: (csrf: string) => void, reject: any) => {
            resolve(csrf);
        });
    });
}

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

export const App : React.StatelessComponent<any> = () => {
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

        </div>
    );
}