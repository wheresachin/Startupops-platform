import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, ArrowLeft, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const plan = state?.plan;
    const price = state?.price;

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    // Mock form state
    const [formData, setFormData] = useState({
        name: user?.name || '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        upiId: ''
    });

    if (!plan) {
        navigate('/app/subscription');
        return null;
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Load Razorpay SDK
        const res = await loadRazorpay();

        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            // Create Order
            const { data: orderData } = await api.post('/subscription/create-order', {
                plan
            });

            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "StartupOps",
                description: `Upgrade to ${plan} Plan`,
                order_id: orderData.id,
                prefill: {
                    name: formData.name,
                    email: user.email,
                    contact: ''
                },
                handler: async function (response) {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plan
                        };

                        const { data } = await api.post('/subscription/verify', verifyData);

                        toast.success(data.message);
                        navigate('/app/dashboard');
                    } catch (error) {
                        toast.error('Payment verification failed');
                        navigate('/app/subscription');
                    }
                },
                theme: {
                    color: "#2563EB",
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        toast('Payment Cancelled');
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error initiating payment');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Plans
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Payment Form */}
                    <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                <ShieldCheck className="w-5 h-5 text-green-500 mr-2" />
                                Secure Checkout
                            </h2>
                        </div>

                        <div className="p-6">
                            {/* Payment Methods */}
                            <div className="flex space-x-4 mb-8">
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === 'card'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                        }`}
                                >
                                    <CreditCard className="w-6 h-6 mb-2" />
                                    <span className="font-medium text-sm">Card</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === 'upi'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                        }`}
                                >
                                    <Wallet className="w-6 h-6 mb-2" />
                                    <span className="font-medium text-sm">UPI</span>
                                </button>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-6">
                                {paymentMethod === 'card' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter name"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                                placeholder="0000 0000 0000 0000"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    name="expiry"
                                                    value={formData.expiry}
                                                    onChange={handleInputChange}
                                                    placeholder="MM/YY"
                                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                                                <input
                                                    type="password"
                                                    name="cvv"
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                    placeholder="123"
                                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">UPI ID</label>
                                        <input
                                            type="text"
                                            name="upiId"
                                            value={formData.upiId}
                                            onChange={handleInputChange}
                                            placeholder="username@bank"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>Processing...</>
                                    ) : (
                                        <>Pay {price}</>
                                    )}
                                </button>
                                <p className="text-center text-xs text-slate-500 mt-4">
                                    By clicking Pay, you agree to our Terms of Service.
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Order Summary</h3>
                            <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                <div>
                                    <p className="font-medium text-slate-900">{plan} Plan</p>
                                    <p className="text-sm text-slate-500">Monthly subscription</p>
                                </div>
                                <p className="font-bold text-slate-900">{price}</p>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <p className="font-bold text-slate-800">Total</p>
                                <p className="font-bold text-xl text-blue-600">{price}</p>
                            </div>

                            <div className="mt-6 bg-blue-50 p-4 rounded-xl flex items-start">
                                <ShieldCheck className="w-5 h-5 text-blue-600 mr-2 shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-700">
                                    Your payment is secured with 256-bit encryption.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
