import apiClient from "./services";

export default {
  // Get all teams
  getAllTeams() {
    return apiClient.get(`/teams`);
  },

  // Get ONE team
  getTeam(id_team) {
    return apiClient.get(`/teams/${id_team}`);
  },

  // Create a team  
  createTeam(data) {
    return apiClient.post(`/teams`, data);
  },

  // Update a team 
  updateTeam(id_team, data) {
    return apiClient.put(`/teams/${id_team}`, data);
  },

  // Delete a team 
  deleteTeam(id_team) {
    return apiClient.delete(`/teams/${id_team}`);
  },

  // Get ALL athletes assigned to a team
  getTeamMembers(id_team) {
    return apiClient.get(`/user-teams/team/${id_team}`);
  },

  // Get team plans  (from our previous step)
  getTeamPlans(id_team) {
    return apiClient.get(`/team-lessons/team/${id_team}`);
  },

  // Assign lesson to team
  assignPlanToTeam(id_team, id_lesson) {
    return apiClient.post(`/team-lessons`, {
      id_team,
      id_lesson,
    });
  },

  // Remove lesson from team
  removePlanFromTeam(id_team, id_lesson) {
    return apiClient.delete(`/team-lessons/${id_team}/${id_lesson}`);
  },

  // Get teams assigned to a user
  getUserTeams(id_user) {
    return apiClient.get(`/user-teams/user/${id_user}`);
  },

  // Assign athlete to team
  assignToTeam(id_user, id_team) {
    return apiClient.post("/user-teams", {
      id_user,
      id_team,
    });
  },

  // Remove athlete from team
  removeFromTeam(id_user, id_team) {
    return apiClient.delete(`/user-teams/${id_user}/${id_team}`);
  },
};
