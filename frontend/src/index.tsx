import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./app";

declare function require(name: string): any

ReactDOM.render(<App props={""} />, document.getElementById("react"));
