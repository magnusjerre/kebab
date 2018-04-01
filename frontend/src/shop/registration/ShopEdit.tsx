import * as React from "react";
import { IShopRegistration, IShopEditProps } from "../shop-interfaces";
import { getCookie, CSRF_COOKIE, fetchCsrf } from "../../utils";

export class ShopEdit extends React.Component<IShopEditProps, IShopRegistration> {
    constructor(props: IShopEditProps) {
        super(props)
        this.state = {
            id: props.id,
            name: props.name,
            address: props.address
        }
        this.registerShop = this.registerShop.bind(this);
        this.saveName = this.saveName.bind(this);
        this.saveAddress = this.saveAddress.bind(this);
    }

    registerShop() {
        fetchCsrf().then((csrf: string) => {
            fetch("/api/closed/shop", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrf
                },
                body: JSON.stringify(this.state)
            }).then((response: Response) => {
                this.props.done();
            });
        });
    }

    saveName(event: React.FormEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            name: event.currentTarget.value
        });
    }

    saveAddress(event: React.FormEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            address: event.currentTarget.value
        });
    }

    render() {
        return (
            <div className="card">
                <h2>Ny sjappe</h2>
                <label className="inline-label" htmlFor="new-shop-name">Navn 
                    <input type="text" id="new-shop-name" name="new-shop-name" required={true} onChange={this.saveName} />
                </label>
                <label className="inline-label" htmlFor="new-shop-address">Adresse 
                    <input type="text" id="new-shop-addresse" name="new-shop-addresse" required={true} onChange={this.saveAddress} />
                </label>
                <button className="kebab-button" onClick={this.registerShop}>Lagre butikk</button>
            </div>
        );
    }
}