import axios from "axios";

const api = axios.create({
  baseURL: "https://loginpage-react-node-js-mongodb.onrender.com",
});

export default api;
