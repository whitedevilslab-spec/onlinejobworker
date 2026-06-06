const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const { v4: uuidv4 } = require('uuid');

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ message: 'Booking ID and amount are required' });
    }

    // Get booking details
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: { bookingId }
    });

    // Create payment record
    const payment = new Payment({
      bookingId,
      userId: req.user.id,
      workerId: booking.workerId,
      amount,
      currency: 'USD',
      paymentMethod: 'stripe',
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      transactionId: uuidv4()
    });

    await payment.save();

    res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentId, paymentIntentId } = req.body;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment failed' });
    }

    // Update payment record
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: 'completed',
        updatedAt: Date.now()
      },
      { new: true }
    );

    // Update booking payment status
    await Booking.findByIdAndUpdate(
      payment.bookingId,
      { paymentStatus: 'completed', status: 'confirmed' }
    );

    res.status(200).json({
      success: true,
      message: 'Payment confirmed',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const payments = await Payment.find({ userId: req.user.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments({ userId: req.user.id });

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      payments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process refund
exports.processRefund = async (req, res) => {
  try {
    const { paymentId, reason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Create Stripe refund
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId
    });

    // Update payment record
    await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: 'refunded',
        refundId: refund.id,
        refundAmount: payment.amount,
        refundReason: reason,
        refundedAt: Date.now(),
        updatedAt: Date.now()
      }
    );

    res.status(200).json({
      success: true,
      message: 'Refund processed',
      refund
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
