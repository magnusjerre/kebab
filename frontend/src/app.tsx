import * as React from "react";

let pluss = require("../images/check.png")
require("../scss/styles.scss")

declare function require(name: string): any

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
                <div><label htmlFor="password">Password:</label><input type="password" id="password" name="password" /></div>
            </form>

            <button onClick={() => {
                fetch("/", {credentials: "same-origin"}).then((response: Response) => {
                    var headers = response.headers as Headers
                    var csrf = headers.get("X-CSRF-TOKEN");
                    console.log("csrf", csrf);
                    setCookie("csrf", csrf, 365);
                    console.log("csrf in cookie", getCookie("csrf"));
                })
            }}>Fetch CSRF</button>

            <button onClick={() => {
                var csrf = getCookie("csrf");
                console.log("csrf from cookie", csrf);
                var password = (document.getElementById("password") as HTMLInputElement).value;
                var username = (document.getElementById("username") as HTMLInputElement).value;
                fetch("/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }, 
                    credentials: 'same-origin',
                    body: `username=${username}&password=${password}&_csrf=${csrf}`
                })
                .then((response: Response) => {
                    var headers = response.headers as Headers;
                    var csrf = headers.get("X-CSRF-TOKEN");
                    setCookie("csrf", csrf, 365);
                    console.log("csrf from login-call", csrf);
                    console.log("csrf in cookie", getCookie("csrf"));
                    return response.body.getReader().read();
                })
                .then(stream => {
                    console.log("stream", stream);
                    const uintToString = (uintArray: any) => {
                        var encodedString = String.fromCharCode.apply(null, uintArray),
                            decodedString = decodeURIComponent(escape(encodedString));
                        return decodedString;
                    }
                    console.log("string", uintToString(stream.value));
                });

            }}>Login button</button>

            <button onClick={() => {
                var csrf = getCookie("csrf");
                console.log("csrf from cookie", csrf);
                var password = (document.getElementById("password") as HTMLInputElement).value;
                var username = (document.getElementById("username") as HTMLInputElement).value;
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
                    var headers = response.headers as Headers;
                    var csrf = headers.get("X-CSRF-TOKEN");
                    setCookie("csrf", csrf, 365);
                    console.log("csrf from create user-call", csrf);
                    console.log("csrf in cookie", getCookie("csrf"));
                    console.log("response", response);
                    return response.json();
                })
                .then(json => {
                    console.log("ny bruker", json);
                });
            }}>Opprett bruker</button>

            <button onClick={() => {
                var csrf = getCookie("csrf");
                fetch("/logout", {
                    method: "POST",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: `_csrf=${csrf}`
                })
                .then((response: Response) => {
                    console.log("response!", response);
                    var headers = response.headers as Headers;
                    var csrf = headers.get("X-CSRF-TOKEN");
                    setCookie("csrf", csrf, 365);
                    console.log("csrf from logout-call", csrf);
                    console.log("csrf in cookie", getCookie("csrf"));
                })
            }}>Log out</button>
            
            <div></div>
            <button onClick={() => {
                fetch("/api/closed/surnames", {
                    method: "GET",
                    credentials: "same-origin"
                })
                .then((response: Response) => {
                    var headers = response.headers as Headers;
                    var csrf = headers.get("X-CSRF-TOKEN");
                    setCookie("csrf", csrf, 365);
                    console.log("csrf from surnmaes-call", csrf);
                    console.log("csrf in cookie", getCookie("csrf"));
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
                    var headers = response.headers as Headers;
                    var csrf = headers.get("X-CSRF-TOKEN");
                    setCookie("csrf", csrf, 365);
                    console.log("csrf from surnmaes-call", csrf);
                    console.log("csrf in cookie", getCookie("csrf"));
                    return response.json();
                })
                .then(json => console.log(json))
            }}>hent åpen data</button>

        </div>
    );
}