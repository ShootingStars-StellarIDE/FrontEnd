import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./Store/store";
import axios from "axios";
import { setupErrorInterceptor_refresh } from "./apis/setupErrorInterceptor_refresh";
import { setupErrorInterceptorAll } from "./apis/setupErrorInterceptorAll";

axios.defaults.baseURL = process.env.REACT_APP_API_PROXY;
axios.defaults.withCredentials = true;

setupErrorInterceptor_refresh();
setupErrorInterceptorAll();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals())
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
