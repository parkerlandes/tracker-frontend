import apiClient from "./services";

export default {
  getLessons() {
    return apiClient.get("/lessons");
  },
  getLesson(id) {
    return apiClient.get(`/lessons/${id}`);
  }, 
  createLesson(lessonData) {
    return apiClient.post(`/lessons`, lessonData); 
  },
};
