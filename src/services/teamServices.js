import apiClient from "./services";

export default {
  getUserTeams(id_user) {
    return apiClient.get(`/user-teams/user/${id_user}`);
  },
  getTeam(id_team) {
    return apiClient.get(`/teams/${id_team}`);
  },
};
