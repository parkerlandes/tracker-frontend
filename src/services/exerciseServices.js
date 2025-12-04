import apiClient from "./services.js";

export default {
  // NEW — get ALL exercises
  getAllExercises() {
    return apiClient.get("/exercises");
  },
  
  // Get all exercises for a specific lesson
  getAll(id_lesson) {
    return apiClient.get(`/lesson/${id_lesson}/exercises`);
  },

  // Get one exercise by its lesson + exercise id
  getExercise(id_lesson, id_exercise) {
    return apiClient.get(`/lesson/${id_lesson}/exercises/${id_exercise}`);
  },

  // Create a new exercise in a specific lesson
  addExercise(id_lesson, data) {
    return apiClient.post(`/lesson/${id_lesson}/exercises`, data);
  },

  // Update an existing exercise
  updateExercise(id_lesson, id_exercise, data) {
    return apiClient.put(`/lesson/${id_lesson}/exercises/${id_exercise}`, data);
  },

  // Delete an exercise
  deleteExercise(id_lesson, id_exercise) {
    return apiClient.delete(`/lesson/${id_lesson}/exercises/${id_exercise}`);
  },

  // Get all published exercises (if needed)
  getPublished(id_lesson) {
    return apiClient.get(`/lesson/${id_lesson}/exercises/published`);
  },
};
