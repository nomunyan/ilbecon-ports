import ReactDOM from "react-dom";
import React from "react";
import App from "./components/App";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";

initializeIcons();
ReactDOM.render(React.createElement(App), document.getElementById("app"));
