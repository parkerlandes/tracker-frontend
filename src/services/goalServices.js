import apiClient from "./services";

export default {
  // Get all goals
  getAllGoals() {
    return apiClient.get("/player-goals");
  },

  // Get goals for a specific user
  getUserGoals(id_user) {
    return apiClient.get(`/player-goals/user/${id_user}`);
  },

  // Get one goal
  getGoal(id_player_goal) {
    return apiClient.get(`/player-goals/${id_player_goal}`);
  },

  // Create a new goal
  createGoal(data) {
    return apiClient.post("/player-goals", data);
  },

  // Update a goal
  updateGoal(id_player_goal, data) {
    return apiClient.put(`/player-goals/${id_player_goal}`, data);
  },

  // Delete a goal
  deleteGoal(id_player_goal) {
    return apiClient.delete(`/player-goals/${id_player_goal}`);
  }
};
