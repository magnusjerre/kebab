import * as React from "react";
import { LoginEnum, ILoggedInHeader, ILoggedOutHeader } from "./user-interfaces";
import { LoginComponent } from "./Login";
import { handleCsrf, fetchCsrf } from "../utils";

const LoggedInHeader : React.StatelessComponent<ILoggedInHeader> = ({enabled, username, logout}) => {
    const clazz = "kebab-button" + (enabled ?  "" : " kebab-button-disabled");
    return (
        <div className="user-header">
            <span className="user-header-username">{username}</span>
            <button className={clazz} onClick={() => { if (enabled) { logout() }}}>Logg ut</button>
        </div>
    );
}

const LoggedOutHeader : React.StatelessComponent<ILoggedOutHeader> = ({login, register, enabled}) => {
    const clazz = "kebab-button" + (enabled ? "" : " kebab-button-disabled");
    return (
        <div className="user-header">
            <button className={clazz} onClick={() => { if (enabled) { login() }}}>Logg inn</button>
            <button className={clazz} onClick={() => { if (enabled) { register() }}}>Opprett bruker</button>
        </div>
    );
}

enum HeaderView { SHOW_LOGGED_IN, SHOW_LOGGED_OUT }
enum LoginContentView { NONE, SHOW_LOGIN, SHOW_REGISTER }
interface ILoginHeader {
    headerView: HeaderView
    contentView: LoginContentView
    username: string
    enableHeaderInputs: boolean
}

export class LoginHeader extends React.Component<{}, ILoginHeader> {
    constructor(props: any) {
        super(props);
        this.state = {
            enableHeaderInputs: true,
            headerView: HeaderView.SHOW_LOGGED_OUT,
            contentView: LoginContentView.NONE,
            username: ""
        }
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
        this.loginSuccess = this.loginSuccess.bind(this);
        this.cancelLoginView = this.cancelLoginView.bind(this);
    }

    logout() {
        this.setState({
            ...this.state,
            enableHeaderInputs: false
        });

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
                const headerView = response.status < 400 ? HeaderView.SHOW_LOGGED_OUT : HeaderView.SHOW_LOGGED_OUT;
                this.setState({
                    ...this.state,
                    enableHeaderInputs: true,
                    contentView: LoginContentView.NONE,
                    headerView: headerView,
                    username: ""
                });
            });
        });
    }

    login() {
        this.setState({
            ...this.state,
            enableHeaderInputs: false,
            contentView: LoginContentView.SHOW_LOGIN
        });
    }

    loginSuccess = (username: string) => {
        this.setState({
            ...this.state,
            enableHeaderInputs: true,
            contentView: LoginContentView.NONE,
            headerView: HeaderView.SHOW_LOGGED_IN,
            username
        });
    }

    cancelLoginView = () => {
        this.setState({
            ...this.state,
            enableHeaderInputs: true,
            contentView: LoginContentView.NONE,
            headerView: HeaderView.SHOW_LOGGED_OUT
        });
    }

    render() {
        const header = this.state.headerView == HeaderView.SHOW_LOGGED_OUT ? 
            <LoggedOutHeader login={() => this.login()} register={() => {}} enabled={this.state.enableHeaderInputs}/> 
            : <LoggedInHeader username={this.state.username} logout={this.logout} enabled={this.state.enableHeaderInputs} />
        const content : any = this.state.contentView == LoginContentView.SHOW_LOGIN ? <LoginComponent onLoginSuccess={this.loginSuccess} onCancel={this.cancelLoginView}/> : null;
        return (
            <div className="login-header-container">
                { header }
                { content }
            </div>
        );
    }
}
