import { data } from "react-router-dom";
import api from "./axiosConfig";

export const plateApi = {
    getByRfid: (rfid_uid) => {
        return api.get(`/plates/rfid/${rfid_uid}`);
    },

    getAll: (params) => {
        return api.get(`/plates`, {params});
    },

    create: (data) => {
        return api.post('/plates', data);
    },

    update: (id, data) => {
        return api.put(`/plates/${id}`, data);
    },

    delete: (id) => {
        return api.delete(`/plates/${id}`);
    }
};