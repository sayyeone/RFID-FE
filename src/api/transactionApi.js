import api from './axiosConfig';

export const transactionApi = {

    create: (data) => {
        return api.post('/transactions', data);
    },

    getHistory: (params) => {
        return api.get('/transactions', { params });
    },

    getDetail: (id) => {
        return api.get(`/transactions/${id}`);
    }
};