import apiClient from "./services.js";

export default {
  // Get all athletes
  getAll() {
    return apiClient.get("/users/athletes");
  },

  // Get athlete by ID
  get(id_user) {
    return apiClient.get(`/user/${id_user}`);
  },

  // Assign athlete to a team
  assignToTeam(id_user, id_team) {
    return apiClient.post("/user-teams", {
      id_user,
      id_team,
    });
  },

  // Remove athlete from a team
  removeFromTeam(id_user, id_team) {
    return apiClient.delete(`/user-teams/${id_user}/${id_team}`);
  },
};
