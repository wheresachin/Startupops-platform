import api from './api';

// Create Razorpay order for subscription
export const createRazorpayOrder = async (plan) => {
    try {
        const { data } = await api.post('/payment/order', { plan });
        return data;
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        throw error;
    }
};

// Verify payment after successful transaction
export const verifyPayment = async (paymentData) => {
    try {
        const { data } = await api.post('/payment/verify', paymentData);
        return data;
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw error;
    }
};

// Get current subscription status
export const getSubscriptionStatus = async () => {
    try {
        const { data } = await api.get('/payment/subscription');
        return data;
    } catch (error) {
        console.error('Error getting subscription status:', error);
        throw error;
    }
};
