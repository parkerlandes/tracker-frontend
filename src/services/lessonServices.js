import apiClient from "./services.js";

export default {
  // 🔹 Lessons
  getLessons() {
    return apiClient.get("/lessons");
  },
  getLesson(id) {
    return apiClient.get(`/lessons/${id}`);
  }, 
  createLesson(lessonData) {
    return apiClient.post(`/lessons`, lessonData); 
  getLesson(id_lesson) {
    return apiClient.get(`/lessons/${id_lesson}`);
  },
  getLessonsForUser(id_user) {
    return apiClient.get(`/lessons/userLesson/${id_user}`);
  },

};
