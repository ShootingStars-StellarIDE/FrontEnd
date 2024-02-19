import axios from "axios";

const baseurl = process.env.REACT_APP_API_PROXY;

const api = axios.create({
  withCredentials: true,
  baseURL: baseurl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
