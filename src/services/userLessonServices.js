import apiClient from "./services.js";

export default {
  getForUser(id_user) {
    return apiClient.get(`/user-lessons/user/${id_user}`);
  },
  getForLesson(id_lesson) {
    return apiClient.get(`/user-lessons/lesson/${id_lesson}`);
  },
  assign(id_user, id_lesson) {
    return apiClient.post(`/user-lessons`, { id_user, id_lesson });
  },
  remove(id_user, id_lesson) {
    return apiClient.delete(`/user-lessons/${id_user}/${id_lesson}`);
  },
};
