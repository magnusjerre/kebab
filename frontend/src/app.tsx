import * as React from "react";

let pluss = require("../images/check.png")
require("../scss/styles.scss")

declare function require(name: string): any

export const App : React.StatelessComponent<any> = () => {
    return (
        <div>
            <p>hello, this is react!</p>
            <img src={pluss}/>
        </div>
    );
}