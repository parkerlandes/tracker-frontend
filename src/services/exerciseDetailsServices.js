import apiClient from "./services.js";

export default {
    getDetails(lessonId, exerciseId){
        return apiClient.get(`${API_URL}/lesson/${lessonId}/exercises/${exerciseId}`);
    },
}