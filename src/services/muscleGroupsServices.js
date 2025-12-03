import apiClient from "./services";

export default{
    getGroups() {
        return apiClient.get("/muscle-groups"); 
    },
}; 