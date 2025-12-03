import apiClient from "./services.js";

export default {
    updateRole(id_user, role){
        return apiClient.put(`/users/role/${id_user}`, { role });
    },

};
