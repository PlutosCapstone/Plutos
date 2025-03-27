import axios from "axios";
import { IP_ADDRESS } from "@env";

const api = axios.create({
  baseURL: `http://192.168.2.102:5001/api`,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

// console.log(`${api.defaults.baseURL}`);
export default api;
