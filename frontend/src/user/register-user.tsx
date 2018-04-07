import * as React from "react";
import { Input } from "../shared/Input";
import { fetchCsrf, handleCsrf } from "../utils";


export interface IRegisterUserProps {
    onRegisterSuccess: (username: string) => void
    onCancel: VoidFunction
}

interface IRegisterUSerState {
    email: string
    errorMessage: string
    username: string
    password: string
}

export class RegisterUserComponent extends React.Component<IRegisterUserProps, IRegisterUSerState> {
    constructor(props: IRegisterUserProps) {
        super(props);
        this.state = {
            email: "",
            errorMessage: "",
            username: "",
            password: ""
        };
        this.register = this.register.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    register = () => {
        if (this.state.email == "" || this.state.username == "" || this.state.password == "") {
            this.setState({
                ...this.state,
                errorMessage: "Alle felter må fylles ut"
            });
            return;
        }
        fetchCsrf().then((csrf: string) => {
            fetch("/api/open/user", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                },
                body: JSON.stringify({
                    "email": this.state.email,
                    "username": this.state.username,
                    "password": this.state.password
                })
            })
            .then((response: Response) => {
                handleCsrf(response);
                if (response.status < 400 && this.props.onRegisterSuccess) {
                    this.props.onRegisterSuccess(this.state.username);
                } else {
                    this.setState({
                        ...this.state,
                        errorMessage: "Klarte ikke opprette bruker..."
                    });
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
                <Input id="email" label="Epost" name="email" required={true} type="text" value={this.state.email} onChange={(val: string) => this.setState({...this.state, email: val, errorMessage: ""})} />
                <Input id="username" label="Brukernavn" name="username" required={true} value={this.state.username} onChange={(val: string) => this.setState({...this.state, username: val, errorMessage: ""})} />
                <Input id="password" label="Passord" name="password" required={true} type="password" value={this.state.password} onChange={(val: string) => this.setState({...this.state, password: val, errorMessage: ""})}/>
                { errorMessage }
                <div className="login-buttons-container">
                    <button className="kebab-button" onClick={this.register}>Logg inn</button>
                    <button className="kebab-button" onClick={this.cancel}>Avbryt</button>
                </div>
            </div>);
    }
}