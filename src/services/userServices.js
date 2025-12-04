import apiClient from "./services.js";

export default {
  // Get ALL users (coaches use this)
  getAllUsers() {
    return apiClient.get("/users");
  },

  // Get one user
  getUser(id_user) {
    return apiClient.get(`/users/${id_user}`);
  },

  // UPDATE user  
  updateUser(id_user, data) {
    return apiClient.put(`/users/${id_user}`, data);
  },

  // Update only the bio field for a user
  updateBio(id_user, bio) {
    return apiClient.put(`/users/${id_user}`, { bio });
  },

  // Create athlete 
  createAthlete(data) {
    return apiClient.post("/users/create-athlete", data);
  },

  // Delete a user 
  deleteUser(id_user) {
    return apiClient.delete(`/users/${id_user}`);
  }
};
