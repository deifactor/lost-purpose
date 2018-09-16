import * as React from "react";
import * as ReactDOM from "react-dom";
import ReactModal = require('react-modal');
import App from "./components/app";

const el = document.createElement("div");
el.id = 'app';
document.body.appendChild(el);
ReactModal.setAppElement('#app');

ReactDOM.render(<App />, el);
