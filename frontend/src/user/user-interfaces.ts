export interface ILoginHeader {
    isLoggedIn: boolean
    view: LoginEnum
    username: string
    animateIn: boolean
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
    enabled: boolean
    username: string
    logout: VoidFunction
}

export interface ILoggedOutHeader {
    login: VoidFunction
    register: VoidFunction
    enabled: boolean
}