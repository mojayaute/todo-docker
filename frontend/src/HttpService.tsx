import axios, { AxiosInstance } from "axios";

const HttpService: AxiosInstance = axios.create({
  baseURL: "http://localhost:3001",
});

export default HttpService;
