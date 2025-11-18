import apiClient from "./services";

export default {
  getUser(id_user) {
    return apiClient.get(`/users/${id_user}`);
  },
};
