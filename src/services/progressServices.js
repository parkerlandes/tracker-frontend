import apiClient from "./services.js";

export default {
  getUserMetrics(id_user) {
    return apiClient.get(`/user-metrics/user/${id_user}`);
  },
  getMostRecent(id_user){
    return apiClient.get(`/user-metrics`)
  }
};

