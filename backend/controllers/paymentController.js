const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Define subscription plans
const SUBSCRIPTION_PLANS = {
    Pro: {
        amount: 50000, // ₹500 in paise
        name: 'Pro Plan',
        duration: 30, // 30 days
    },
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/order
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { plan } = req.body;

        // Validate plan
        if (!SUBSCRIPTION_PLANS[plan]) {
            return res.status(400).json({ message: 'Invalid subscription plan' });
        }

        const planDetails = SUBSCRIPTION_PLANS[plan];

        const options = {
            amount: planDetails.amount,
            currency: "INR",
            receipt: `receipt_${req.user._id}_${Date.now()}`,
            notes: {
                userId: req.user._id.toString(),
                plan: plan,
            },
        };

        const order = await razorpay.orders.create(options);

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            plan: plan,
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing payment details' });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment Success - Update user subscription
            const user = await User.findById(req.user._id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Calculate subscription dates
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + (SUBSCRIPTION_PLANS[plan]?.duration || 30));

            // Update subscription
            user.subscription.plan = plan;
            user.subscription.status = 'active';
            user.subscription.razorpayPaymentId = razorpay_payment_id;
            user.subscription.razorpayCustomerId = razorpay_order_id;
            user.subscription.startDate = startDate;
            user.subscription.endDate = endDate;

            await user.save();

            res.json({
                status: "success",
                message: `Payment verified! Upgraded to ${plan} plan`,
                subscription: {
                    plan: user.subscription.plan,
                    status: user.subscription.status,
                    startDate: user.subscription.startDate,
                    endDate: user.subscription.endDate,
                }
            });
        } else {
            res.status(400).json({ status: "failure", message: "Invalid signature - payment verification failed" });
        }
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ message: 'Error verifying payment', error: error.message });
    }
};

// @desc    Get current subscription status
// @route   GET /api/payment/subscription
// @access  Private
exports.getSubscriptionStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('subscription');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if subscription has expired
        const now = new Date();
        if (user.subscription.endDate && now > user.subscription.endDate) {
            user.subscription.status = 'expired';
            user.subscription.plan = 'Free';
            await user.save();
        }

        res.json({
            plan: user.subscription.plan,
            status: user.subscription.status,
            startDate: user.subscription.startDate,
            endDate: user.subscription.endDate,
        });
    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({ message: 'Error fetching subscription status', error: error.message });
    }
};
