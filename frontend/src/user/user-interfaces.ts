export interface ILoginHeader {
    isLoggedIn: boolean
    viewState: LoginEnum
    username: string
}

export interface ILoginUserInfo {
    username: string
    password: string
}

export interface IRegisterUserInfo extends ILoginUserInfo {
    email: string
}

export enum LoginEnum {
    SHOW_LOGGED_IN_HEADER, SHOW_LOGGED_OUT_HEADER, SHOW_LOGIN, SHOW_REGISTER
}

export interface ILoggedInHeader {
    username: string
    logout: VoidFunction
}

export interface ILoggedOutHeader {
    login: VoidFunction
    register: VoidFunction
}