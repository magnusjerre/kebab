import * as React from "react";
import { ILoginHeader, LoginEnum, ILoggedInHeader, ILoggedOutHeader } from "./user-interfaces";
import { LoginComponent } from "./Login";
import { handleCsrf, fetchCsrf } from "../utils";

const LoggedInHeader : React.StatelessComponent<ILoggedInHeader> = ({username, logout}) => (
    <div className="user-header">
        <span>{username}</span>
        <button className="kebab-button" onClick={() => logout()}>Logg ut</button>
    </div>
);

const LoggedOutHeader : React.StatelessComponent<ILoggedOutHeader> = ({login, register}) => (
    <div className="user-header">
        <button className="kebab-button" onClick={() => login()}>Logg inn</button>
        <button className="kebab-button" onClick={() => register()}>Opprett bruker</button>
    </div>
);

export class LoginHeader extends React.Component<{}, ILoginHeader> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLoggedIn: false,
            viewState: LoginEnum.SHOW_LOGGED_OUT_HEADER,
            username: ""
        }
        this.logout = this.logout.bind(this);
    }

    logout() {
        fetchCsrf().then((csrf: string) => {
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
                this.setState({
                    isLoggedIn: false,
                    viewState: LoginEnum.SHOW_LOGGED_OUT_HEADER,
                    username: ""
                });
            });
        });
    }

    render() {
        switch(this.state.viewState) {
                case LoginEnum.SHOW_LOGIN: return <LoginComponent onLoginSuccess={(username: string) => {
                    this.setState({
                        isLoggedIn: true,
                        viewState: LoginEnum.SHOW_LOGGED_IN_HEADER,
                        username
                    });
                }} />;
                case LoginEnum.SHOW_LOGGED_IN_HEADER: return <LoggedInHeader username={this.state.username} logout={() => this.logout()}/>;
                case LoginEnum.SHOW_LOGGED_OUT_HEADER: return <LoggedOutHeader login={() => {
                    this.setState({
                        isLoggedIn: false,
                        viewState: LoginEnum.SHOW_LOGIN,
                        username: ""
                    });
                }} register={() => {
                    this.setState({
                        isLoggedIn: false,
                        viewState: LoginEnum.SHOW_REGISTER,
                        username: ""
                    });
                }} />;
                default: return null;
        }
    }
}
