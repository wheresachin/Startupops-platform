import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PricingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentPlan, setCurrentPlan] = useState('Free');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const { data } = await axios.get('/api/subscription/current', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setCurrentPlan(data.subscription.plan);
        } catch (error) {
            console.error('Error fetching subscription:', error);
        }
    };

    const handleUpgrade = (plan, price) => {
        if (plan === currentPlan) return;
        navigate('/app/payment', { state: { plan, price } });
    };

    // ... existing plans array
    // Update plans array to send price string correctly if needed, or extract from array.
    // Easier to just find plan object in handleUpgrade or pass price directly.

    // I need to update the button click to pass price


    const plans = [
        {
            name: 'Free',
            price: '₹0',
            features: [
                'Founder account',
                '2 Team Members',
                '2 Investors',
                '1 Mentor',
                'Basic task & tracking',
                'Feedback collection',
                'Basic analytics'
            ],
            notIncluded: [
                'Advanced analytics',
                'Unlimited members'
            ],
            color: 'bg-slate-100',
            btnColor: 'bg-slate-800'
        },
        {
            name: 'Pro',
            price: '₹599',
            period: '/mo',
            features: [
                'Founder account',
                'Up to 5 Team Members',
                'Up to 5 Investors',
                'Up to 3 Mentors',
                'Unlimited tasks',
                'Structured feedback',
                'Advanced analytics',
                'Priority features'
            ],
            color: 'bg-blue-50 border-blue-200',
            btnColor: 'bg-blue-600',
            popular: true
        },
        {
            name: 'Enterprise',
            price: '₹1999',
            period: '/mo',
            features: [
                'Founder account',
                'Unlimited Team Members',
                'Unlimited Investors',
                'Unlimited Mentors',
                'Advanced analytics & insights',
                'Full feedback system',
                'Investor-ready dashboard',
                'Premium support'
            ],
            color: 'bg-purple-50 border-purple-200',
            btnColor: 'bg-purple-600'
        }
    ];

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                    Choose the right plan for your startup
                </h2>
                <p className="mt-4 text-xl text-slate-600">
                    Scale your operations with our flexible pricing models.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative rounded-2xl p-8 border ${plan.name === 'Pro' ? 'border-blue-500 shadow-xl scale-105' : 'border-slate-200 shadow-sm'} bg-white flex flex-col`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                Most Popular
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                        <div className="mt-4 flex items-baseline">
                            <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                            {plan.period && <span className="ml-1 text-slate-500">{plan.period}</span>}
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                            {plan.name === 'Free' ? 'For early-stage / idea validation' :
                                plan.name === 'Pro' ? 'For growing startups' : 'For scaling startups'}
                        </p>

                        <div className="mt-6 space-y-4 flex-1">
                            {plan.features.map((feature) => (
                                <div key={feature} className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                                    <span className="text-slate-600 text-sm">{feature}</span>
                                </div>
                            ))}
                            {plan.notIncluded?.map((feature) => (
                                <div key={feature} className="flex items-start">
                                    <X className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                                    <span className="text-slate-400 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handleUpgrade(plan.name)}
                            disabled={loading || currentPlan === plan.name}
                            className={`mt-8 w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${currentPlan === plan.name
                                ? 'bg-green-600 cursor-default'
                                : plan.btnColor + ' hover:opacity-90'
                                } disabled:opacity-50`}
                        >
                            {currentPlan === plan.name ? 'Current Plan' :
                                loading ? 'Processing...' : `Upgrade to ${plan.name}`}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center text-slate-500 text-sm">
                Secure payment via Razorpay/Stripe (Mock)
            </div>
        </div>
    );
};

export default PricingPage;
