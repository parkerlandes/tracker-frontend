import axios from "axios";

const API_URL = "http://localhost:3100/tracker-t9";

class AuthServices {
  loginUser(token) {
    return axios.post(`${API_URL}/login`, token);
  }
}

export default new AuthServices();
