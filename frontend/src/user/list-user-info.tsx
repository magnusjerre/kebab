import * as React from "react";

interface ILUI {
    isLoggedIn: boolean
    onLoginClicked: VoidFunction
    onLogoutClicked: VoidFunction
    onRegisterClicked: VoidFunction
    username: string
}

export const ListUserInfo: React.StatelessComponent<ILUI> = ({ isLoggedIn, onLoginClicked, onLogoutClicked, onRegisterClicked, username }) => (
    <ul className="lui-list">
        {isLoggedIn && <li className="username">{username}</li>}
        {isLoggedIn && <li onClick={() => onLogoutClicked()} tabIndex={0}>Logg ut</li>}
        {!isLoggedIn && <li onClick={() => onLoginClicked()} tabIndex={0}>Logg inn</li>}
        {!isLoggedIn && <li onClick={() => onRegisterClicked()} tabIndex={0}>Registrer</li>}
    </ul>
);