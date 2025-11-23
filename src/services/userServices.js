import apiClient from "./services.js";

export default {
  getAllUsers() {
    return apiClient.get("/users/athletes"); 
  },

  getUser(id) {
    return apiClient.get(`/user/${id}`);
  },
};
