import apiClient from "./services.js";

export default {
  getGoalsForUser(userId) {
    return apiClient.get(`/player-goals/users/${userId}`); 
  },

  createGoal(goalData) {
    return apiClient.post(`/player-goals`, goalData); 
  },

  getAllExercises() {
    return apiClient.get(`/lesson`); 
  },

  updateGoal(id, goalData) {
    return apiClient.put(`/player-goals/${id}`, goalData); 
  },

  deleteGoal(id) {
    return apiClient.delete(`/player-goals/${id}`); 
  },
};