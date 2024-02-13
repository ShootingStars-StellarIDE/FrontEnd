import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./ Store/store";
import { setupAxiosInterceptors } from "./components/Login/setupAxiosInterceptors";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_PROXY;
axios.defaults.withCredentials = true;

// setupAxiosInterceptors();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
