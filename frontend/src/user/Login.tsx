import * as React from "react";
import { Input } from "../shared/Input";
import { fetchCsrf, handleCsrf } from "../utils";


export interface ILoginProps {
    onLoginSuccess: (username: string) => void
    onCancel: VoidFunction
}

interface ILoginState {
    errorMessage: string
    username: string
    password: string
}

export class LoginComponent extends React.Component<ILoginProps, ILoginState> {
    constructor(props: ILoginProps) {
        super(props);
        this.state = {
            errorMessage: "",
            username: "",
            password: ""
        };
        this.login = this.login.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    login = () => {
        if (this.state.username == "" || this.state.password == "") {
            this.setState({
                ...this.state,
                errorMessage: "Alle felter må fylles ut"
            });
            return;
        }
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
                if (response.status == 401) {
                    this.setState({
                        ...this.state,
                        errorMessage: "Wrong username / password"
                    });
                } else if (response.status < 400 && this.props.onLoginSuccess) {
                    this.props.onLoginSuccess(this.state.username);
                }
            })
        });
    }

    cancel = () => {
        this.props.onCancel();
    }

    render() {
        const errorMessage = this.state.errorMessage  == "" ? null : <p className="error-message">{this.state.errorMessage}</p>;
        return (
            <div className="login-component">
                <Input id="username" label="Brukernavn" name="username" required={true} value={this.state.username} onChange={(val: string) => this.setState({...this.state, username: val, errorMessage: ""})}/>
                <Input id="password" label="Passord" name="password" required={true} type="password" value={this.state.password} onChange={(val: string) => this.setState({...this.state, password: val, errorMessage: ""})}/>
                { errorMessage }
                <div className="login-buttons-container">
                    <button className="kebab-button" onClick={this.login}>Logg inn</button>
                    <button className="kebab-button" onClick={this.cancel}>Avbryt</button>
                </div>
            </div>);
    }
}