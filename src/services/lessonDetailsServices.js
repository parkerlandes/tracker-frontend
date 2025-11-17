import apiClient from "./services.js";

export default {
    getLesson(lessonId){
        return apiClient.get(`${API}/lessons/${lessonId}`);
    },
    getLessonExercise(lessonId, user){
        return apiClient.get(`${API}/lesson/${lessonId}/exercises`, {
            headers: { Authorization: `Bearer ${user}` },
        });
    },
    newLesson(lessonId, newExercise, user){
        return apiClient.post(`${API}/lesson/${lessonId}/exercises`, newExercise, {
        headers: { Authorization: `Bearer ${user}` },
      });
    },
    updateLesson(lesson, exerciseId, exerciseValue, user){
        return apiClient.put(
            `${API}/lesson/${editExercise.value.id_lesson}/exercises/${editExercise.value.id_exercise}`,
            editExercise.value,
            { headers: { Authorization: `Bearer ${user.token}` } }
        );
    },
    deleteLesson(lesson, exercise, user){
        return apiClient.delete(
            `${API}/lesson/${lesson}/exercises/${exercise}`,
            { headers: { Authorization: `Bearer ${user}` } }
        );
    },
}