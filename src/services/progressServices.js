import apiClient from "./services.js";

export default {
  getUserMetrics(id_user) {
    return apiClient.get(`/user-metrics/user/${id_user}`);
  },
  getLatestForUser(id_user){
    return apiClient.get(`/user-metrics/user/${id_user}/latest`);
  },
  createUserMetric(data) {
    return apiClient.post(`/user-metrics`, data);
  }
};
