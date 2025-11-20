import apiClient from "./services.js";

export default {
  // Get all lessons
  getAll() {
    return apiClient.get("/lessons");
  },

  // Get all lessons for a specific user
  getAllForUser(userId) {
    return apiClient.get(`/lessons/userLesson/${userId}`);
  },

  // Get one lesson by id
  get(id) {
    return apiClient.get(`/lessons/${id}`);
  },

  // Create a new lesson
  create(data) {
    return apiClient.post("/lessons", data);
  },

  // Update lesson
  update(id, data) {
    return apiClient.put(`/lessons/${id}`, data);
  },

  // Delete lesson
  delete(id) {
    return apiClient.delete(`/lessons/${id}`);
  },
};

