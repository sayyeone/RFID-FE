import api from './axiosConfig';

export const paymentApi = {
  // Create payment / Get snap token
  createSnapToken: (transactionId) => {
    return api.post(`/payment/snap/${transactionId}`);
  },

  // Check payment status
  checkStatus: (orderId) => {
    return api.get(`/payment/status/${orderId}`);
  },

  // Handle webhook (backend-only, tapi bisa dipake untuk polling)
  getTransactionStatus: (transactionId) => {
    return api.get(`/transactions/${transactionId}/status`);
  }
};
