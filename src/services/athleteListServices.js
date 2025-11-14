import apiClient from "./services.js";

export default {
  // ✅ Get all athletes
  getAllAthletes() {
    return apiClient.get("/user/athletes");
  },

  // ✅ Get all teams
  getAllTeams() {
    return apiClient.get("/teams");
  },

  // ✅ Assign athlete to a team
  assignToTeam(id_user, id_team) {
    return apiClient.post("/user-teams", { id_user, id_team });
  },
};