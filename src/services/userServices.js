import apiClient from "./services";

export default {
  getUser(id_user) {
    return apiClient.get(`/users/${id_user}`);
  },
  updateUser(id_user, payload) {
    return apiClient.put(`/users/${id_user}`, payload);
  },
};
