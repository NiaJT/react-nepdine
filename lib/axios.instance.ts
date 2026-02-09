import { AxiosInstance } from "axios";
import axios from "axios";
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://api.nepdine.klaguso.com/api/v1",
  timeout: 5000,
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
