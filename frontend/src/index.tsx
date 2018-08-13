import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactModal from 'react-modal';
import App from "./app";

const el = document.createElement("div");
el.id = 'app';
document.body.appendChild(el);
ReactModal.setAppElement('#app');

ReactDOM.render(<App />, el);
