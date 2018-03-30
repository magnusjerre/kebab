import * as React from "react";
import {Shop} from "./models";
import { CSRF_COOKIE, getCookie } from "./utils";

export class ShopEdit extends React.Component<{}, Shop> {
    constructor(props: any) {
        super(props);
        this.state = {
            "id": "",
            "name": "",
            "address": ""
        };
        this.registerShop = this.registerShop.bind(this);
    }

    registerShop() {
        console.log("register shop called");
        fetch("/api/closed/shop", {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": getCookie(CSRF_COOKIE)
            },
            body: JSON.stringify({"name":this.state.name, "address": this.state.address})
        }).then((response: Response) => {
            this.setState({"id": "", "name": "", "address": ""});
        });
    }

    render() {
        return (
            <div>
                <h2>Ny sjappe</h2>
                <label htmlFor="name">Navn: <input type="text" id="name" name="name" value={this.state.name} onChange={(e: React.FormEvent<HTMLInputElement>) => this.setState({"name": e.currentTarget.value,"address": this.state.address})}/></label>
                
                <label htmlFor="address">Adresse: <input type="text" id="address" name="address" value={this.state.address} onChange={(e: React.FormEvent<HTMLInputElement>) => this.setState({"name": this.state.name, "address": e.currentTarget.value})} /></label>
                <button onClick={() => this.registerShop()}>Lagre sjappe</button>
            </div>
        );   
    }
}