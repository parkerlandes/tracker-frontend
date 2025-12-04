import apiClient from "./services.js";

export default {
  // Create a new goal
  create(goalData) {
    return apiClient.post("/player-goals", goalData);
  },

  // Get all goals
  getAll() {
    return apiClient.get("/player-goals");
  },

  // Get goals for a single athlete
  getForUser(id_user) {
    return apiClient.get(`/player-goals/user/${id_user}`);
  },

  // Get a single goal
  get(id_player_goal) {
    return apiClient.get(`/player-goals/${id_player_goal}`);
  },

  // Update goal
  update(id_player_goal, data) {
    return apiClient.put(`/player-goals/${id_player_goal}`, data);
  },

  // Delete goal
  delete(id_player_goal) {
    return apiClient.delete(`/player-goals/${id_player_goal}`);
  },
};
