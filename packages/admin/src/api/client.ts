import axios from "axios";

const APIClient = axios.create({
  baseURL: `${window.location.origin}/feature-flags`,
  headers: { "Content-Type": "application/json" },
});

export default APIClient;
