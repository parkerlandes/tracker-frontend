import apiClient from "./services.js";

export default {
  getAllUsers() {
    return apiClient.get("/users/athletes"); 
  },

  getUser(id) {
    // Backend exposes user routes under /users/:id_user (plural)
    return apiClient.get(`/users/${id}`);
  },
};
