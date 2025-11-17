import apiClient from "./services.js";

export default {
    getAthlete(athleteId){
        return apiClient.get(`${API}/user/${athleteId}`);
    },
    updateAthlete(athleteId, data){
        return apiClient.put(`${API}/user/${athleteId}`, data);
    }
}