import apiClient from "./services.js";

export default {
  // Get all athletes
  getAll() {
    return apiClient.get("/users/athletes");
  },

  // Get athlete by ID
  get(id_user) {
    return apiClient.get(`/users/${id_user}`);
  },

  // ADD NEW ATHLETE
  createAthlete(athleteData) {
    return apiClient.post("/users/create-athlete", athleteData);
  },

  // UPDATE athlete
  update(id_user, athleteData) {
    return apiClient.put(`/users/${id_user}`, athleteData);
  },

  // DELETE athlete
  delete(id_user) {
    return apiClient.delete(`/users/${id_user}`);
  },
};
