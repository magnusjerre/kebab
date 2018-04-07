import * as React from "react";
import { Input } from "../shared/Input";
import { fetchCsrf, handleCsrf } from "../utils";


export interface ILoginProps {
    onLoginSuccess: (username: string) => void
}

interface ILoginState {
    username: string
    password: string
}

export class LoginComponent extends React.Component<ILoginProps, ILoginState> {
    constructor(props: ILoginProps) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
        this.login = this.login.bind(this);
    }

    login() {
        fetchCsrf().then((csrf: string) => {
            fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }, 
                credentials: 'same-origin',
                body: `username=${this.state.username}&password=${this.state.password}&_csrf=${csrf}`
            }).then((response: Response) => {
                handleCsrf(response);
                if (response.status < 400 && this.props.onLoginSuccess) this.props.onLoginSuccess(this.state.username);
            })
        });
    }

    render() {
        return (
            <div>
                <div className="login-component">
                    <h2>Logg inn</h2>
                    <Input id="username" label="Brukernavn" name="username" required={true} value={this.state.username} onChange={(val: string) => this.setState({...this.state, username: val})}/>
                    <Input id="password" label="Passord" name="password" required={true} type="password" value={this.state.password} onChange={(val: string) => this.setState({...this.state, password: val})}/>
                    <button className="kebab-button" onClick={() => this.login()}>Logg inn</button>
                </div>
                <div className="login-background"></div>
            </div>);
    }
}