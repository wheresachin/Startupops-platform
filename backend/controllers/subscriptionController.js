const Startup = require('../models/Startup');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Plan Limits Configuration
const PLAN_LIMITS = {
    Free: { team: 2, investors: 2, mentors: 1, price: 0 },
    Pro: { team: 5, investors: 5, mentors: 3, price: 59900 }, // in paise (599 INR)
    Enterprise: { team: Infinity, investors: Infinity, mentors: Infinity, price: 199900 } // in paise (1999 INR)
};

// @desc    Create Razorpay Order
// @route   POST /api/subscription/create-order
// @access  Private (Founder only)
exports.createOrder = async (req, res) => {
    try {
        const { plan } = req.body;

        if (!PLAN_LIMITS[plan]) {
            return res.status(400).json({ message: 'Invalid plan selected' });
        }

        const amount = PLAN_LIMITS[plan].price;
        const options = {
            amount: amount,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error creating order' });
    }
};

// @desc    Verify Payment and Upgrade subscription
// @route   POST /api/subscription/verify
// @access  Private (Founder only)
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment verified, update subscription
            const startup = await Startup.findOne({ founder: req.user._id });
            if (!startup) {
                return res.status(404).json({ message: 'Startup not found' });
            }

            startup.subscription.plan = plan;
            startup.subscription.status = 'active';
            startup.subscription.startDate = Date.now();
            startup.subscription.validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days validity

            await startup.save();

            res.json({
                message: `Payment successful! Upgraded to ${plan} plan.`,
                subscription: startup.subscription
            });
        } else {
            res.status(400).json({
                message: 'Payment verification failed',
            });
        }

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ message: 'Server error verifying payment' });
    }
};

// @desc    Get current subscription details
// @route   GET /api/subscription/current
// @access  Private (Founder only)
exports.getSubscription = async (req, res) => {
    try {
        const startup = await Startup.findOne({ founder: req.user._id });
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        const currentPlan = startup.subscription.plan;
        // Strip price from limits before sending if needed, or send it
        const limits = { ...PLAN_LIMITS[currentPlan] };
        delete limits.price;

        res.json({
            subscription: startup.subscription,
            limits,
            usage: {
                team: startup.team.length,
            }
        });

    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.PLAN_LIMITS = PLAN_LIMITS;
