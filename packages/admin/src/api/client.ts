import axios from "axios";

const APIClient = axios.create({
  baseURL: `${window.location.origin}/libreflag`,
  headers: { "Content-Type": "application/json" },
});

export default APIClient;
