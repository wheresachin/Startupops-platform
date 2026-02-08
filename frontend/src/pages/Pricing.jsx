import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRazorpayOrder, verifyPayment } from '../services/paymentService';
import toast from 'react-hot-toast';
import { Check, X, Sparkles, Zap, TrendingUp, Users } from 'lucide-react';

const Pricing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);

    const plans = {
        free: {
            name: 'Free',
            price: 0,
            period: 'forever',
            features: [
                { text: 'Up to 10 tasks', included: true },
                { text: 'Basic analytics', included: true },
                { text: 'Up to 3 feedback links', included: true },
                { text: 'Team collaboration', included: true },
                { text: 'Advanced analytics', included: false },
                { text: 'Unlimited tasks', included: false },
                { text: 'Unlimited feedback links', included: false },
                { text: 'Priority support', included: false },
            ],
        },
        pro: {
            name: 'Pro',
            price: 500,
            period: 'month',
            features: [
                { text: 'Unlimited tasks', included: true },
                { text: 'Advanced analytics', included: true },
                { text: 'Unlimited feedback links', included: true },
                { text: 'Team collaboration', included: true },
                { text: 'Priority support', included: true },
                { text: 'Custom branding', included: true },
                { text: 'API access', included: true },
                { text: 'Export data', included: true },
            ],
        },
    };

    const handleUpgrade = async () => {
        if (!user) {
            toast.error('Please login to upgrade');
            navigate('/login');
            return;
        }

        setProcessing(true);

        try {
            // Create Razorpay order
            const orderData = await createRazorpayOrder('Pro');

            // Initialize Razorpay checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'StartupOps',
                description: 'Pro Plan Subscription',
                order_id: orderData.orderId,
                handler: async function (response) {
                    try {
                        // Verify payment on backend
                        const result = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plan: 'Pro',
                        });

                        toast.success(result.message || 'Successfully upgraded to Pro!');

                        // Reload to update user context
                        setTimeout(() => {
                            window.location.href = '/app/dashboard';
                        }, 1500);
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        toast.error(error.response?.data?.message || 'Payment verification failed');
                    } finally {
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#6366f1',
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                        toast.error('Payment cancelled');
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Order creation failed:', error);
            toast.error(error.response?.data?.message || 'Failed to initiate payment');
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Start free and upgrade as you grow. All plans include core features.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl transition-shadow">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-6 h-6 text-gray-600" />
                                <h2 className="text-2xl font-bold text-gray-900">{plans.free.name}</h2>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-gray-900">₹{plans.free.price}</span>
                                <span className="text-gray-600">/{plans.free.period}</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {plans.free.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    {feature.included ? (
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                                    )}
                                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                                        {feature.text}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button
                            className="w-full py-3 px-6 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                            onClick={() => navigate('/signup')}
                        >
                            {user ? 'Current Plan' : 'Get Started'}
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl border-2 border-indigo-700 p-8 text-white relative overflow-hidden hover:shadow-3xl transition-shadow">
                        <div className="absolute top-4 right-4">
                            <span className="bg-yellow-400 text-indigo-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                <Sparkles className="w-4 h-4" />
                                Popular
                            </span>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">{plans.pro.name}</h2>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold">₹{plans.pro.price}</span>
                                <span className="text-indigo-100">/{plans.pro.period}</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {plans.pro.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                                    <span className="text-white">{feature.text}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={handleUpgrade}
                            disabled={processing || (user?.subscription?.plan === 'Pro')}
                            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${processing || (user?.subscription?.plan === 'Pro')
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:scale-105'
                                }`}
                        >
                            {processing ? (
                                <span>Processing...</span>
                            ) : user?.subscription?.plan === 'Pro' ? (
                                <span>Current Plan</span>
                            ) : (
                                <>
                                    <TrendingUp className="w-5 h-5" />
                                    Upgrade to Pro
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-20 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-2">Can I switch plans anytime?</h3>
                            <p className="text-gray-600">
                                Yes! You can upgrade to Pro anytime. Your subscription will be active for 30 days from the date of payment.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                            <p className="text-gray-600">
                                We accept all major credit/debit cards, UPI, net banking, and wallets through Razorpay.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-2">Is there a refund policy?</h3>
                            <p className="text-gray-600">
                                We offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
