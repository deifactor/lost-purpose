import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";

const el = document.createElement("div");
document.body.appendChild(el);

ReactDOM.render(<App apiBase="/" />, el);
