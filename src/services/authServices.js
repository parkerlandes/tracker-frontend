
import apiClient from "./services.js";

class AuthServices {
  loginUser(token) {
    return apiClient.post(`${API_URL}/login`, token);
  }
}

export default new AuthServices();
