import * as React from "react";
import { LoginEnum, ILoggedInHeader, ILoggedOutHeader } from "./user-interfaces";
import { LoginComponent } from "./Login";
import { handleCsrf, fetchCsrf } from "../utils";
import { RegisterUserComponent } from "./register-user";
import { ListUserInfo } from "./list-user-info";

enum LoginContentView { NONE, SHOW_LOGIN, SHOW_REGISTER, SHOW_MENU }
interface ILoginHeader {
    contentView: LoginContentView
    username: string
    isLoggedIn: boolean
    enableHeaderInputs: boolean
}

export interface ILoginHeaderProps {
    loggedInState: (value: boolean) => void
    title: string
    onGoBack: VoidFunction
    showGoBack: boolean
}

export class LoginHeader extends React.Component<ILoginHeaderProps, ILoginHeader> {
    constructor(props: any) {
        super(props);
        this.state = {
            enableHeaderInputs: true,
            contentView: LoginContentView.NONE,
            username: "",
            isLoggedIn: false
        }
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
        this.loginSuccess = this.loginSuccess.bind(this);
        this.cancelLoginView = this.cancelLoginView.bind(this);
        this.register = this.register.bind(this);
        this.registerSuccess = this.registerSuccess.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
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
                this.props.loggedInState(false);
                this.setState({
                    ...this.state,
                    enableHeaderInputs: true,
                    contentView: LoginContentView.NONE,
                    isLoggedIn: false,
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

    register = () => {
        this.setState({
            ...this.state,
            enableHeaderInputs: false,
            contentView: LoginContentView.SHOW_REGISTER
        });
    }

    loginSuccess = (username: string) => {
        this.setState({
            ...this.state,
            enableHeaderInputs: true,
            contentView: LoginContentView.NONE,
            isLoggedIn: true,
            username
        });
        this.props.loggedInState(true);
    }

    cancelLoginView = () => {
        this.setState({
            ...this.state,
            enableHeaderInputs: true,
            contentView: LoginContentView.NONE,
        });
    }

    registerSuccess = () => {
        this.setState({
            ...this.state,
            enableHeaderInputs: false,
            contentView: LoginContentView.SHOW_LOGIN,
        });
    }

    toggleMenu = () => {
        if (this.state.contentView == LoginContentView.SHOW_MENU) {
            this.setState({
                ...this.state,
                contentView: LoginContentView.NONE
            });
        } else {
            this.setState({
                ...this.state,
                contentView: LoginContentView.SHOW_MENU
            });
        }
    }

    render() {
        const content : any = this.state.contentView == LoginContentView.SHOW_LOGIN ? <LoginComponent onLoginSuccess={this.loginSuccess} onCancel={this.cancelLoginView}/> : ( this.state.contentView == LoginContentView.SHOW_REGISTER ? <RegisterUserComponent onRegisterSuccess={this.registerSuccess} onCancel={this.cancelLoginView}/>: ( this.state.contentView == LoginContentView.SHOW_MENU ? <ListUserInfo isLoggedIn={this.state.isLoggedIn} onLoginClicked={this.login} onLogoutClicked={this.logout} onRegisterClicked={this.register} username={this.state.username}/> : null));
        return (
            <div className="login-header-container">
                <div className="user-header">
                    <div className="nav-button-container">
                        { this.props.showGoBack && <button onClick={() => this.props.onGoBack()} className="kebab-button">Back</button> }
                    </div>
                    <h1>{this.props.title}</h1>
                    <div className="nav-button-container">
                        <button className="user-icon" onClick={this.toggleMenu}></button>
                    </div>
                </div>
                { content }
            </div>
        );
    }
}
