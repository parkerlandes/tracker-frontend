import apiClient from "./services";

export default {
  getLessons() {
    return apiClient.get("/lessons");
  },
  getLesson(id_lesson) {
    return apiClient.get(`/lessons/${id_lesson}`);
  },
  getLessonsForUser(id_user) {
    return apiClient.get(`/lessons/userLesson/${id_user}`);
  },
};

