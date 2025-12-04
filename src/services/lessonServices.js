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
  createLesson(data) {
    return apiClient.post("/lessons", {
      title: data.title,
      description: data.description,
      published: false,
      id_user: data.id_user, // optional owner/creator
      id_muscle_group: data.id_muscle_group,
      assignedUsers: data.assignedUsers || [],
    });
  },

  // Get lessons for a specific user
  getLessonsForUser(id_user) {
    return apiClient.get(`/user-lessons/user/${id_user}`);
  },

  deleteLesson(id_lesson) {
    return apiClient.delete(`/lessons/${id_lesson}`);
  }
  
};

