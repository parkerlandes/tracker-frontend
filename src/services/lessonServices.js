import apiClient from "./services.js";

export default {
  getLessons() {
    return apiClient.get("/lessons");
  },
  getLesson(id) {
    return apiClient.get(`/lessons/${id}`);
  },
};
