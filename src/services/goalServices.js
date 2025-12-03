import apiClient from "./services";

export default {
  getUserGoals(id_user) {
    return apiClient.get(`/player-goals/users/${id_user}`);
  },
};

