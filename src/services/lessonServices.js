import apiClient from "./services.js";

export default {
  // Get all lessons
  getLessons() {
    return apiClient.get("/lessons");
  },

  // Get one lesson by lesson ID
  getLesson(id_lesson) {
    return apiClient.get(`/lessons/${id_lesson}`);
  },

  // Create new lesson
  createLesson(lessonData) {
    return apiClient.post(`/lessons`, lessonData);
  },

  // Get lessons for specific user
  getLessonsForUser(id_user) {
    return apiClient.get(`/lessons/userLesson/${id_user}`);
  },
};
