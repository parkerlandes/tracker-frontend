import apiClient from "./services";

export default {
  getProgressForGoal(id_player_goal) {
    return apiClient.get(`/player-goal-progress/goal/${id_player_goal}`);
  },
  createProgressEntry(data) {
    return apiClient.post(`/player-goal-progress`, data);
  },
};
