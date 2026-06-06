const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Worker = require('../models/Worker');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { workerId, serviceType, bookingDate, duration, totalAmount, notes, serviceLocation } = req.body;

    if (!workerId || !serviceType || !bookingDate || !duration || !totalAmount) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Verify worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    // Create booking
    const booking = new Booking({
      userId: req.user.id,
      workerId,
      serviceType,
      bookingDate,
      duration,
      totalAmount,
      notes,
      serviceLocation,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking details
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('workerId', 'name hourlyRate');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status,
        updatedAt: Date.now(),
        ...(status === 'completed' && { completedAt: Date.now() })
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled',
        cancellationReason,
        cancelledBy: 'user',
        cancelledAt: Date.now(),
        paymentStatus: 'refunded'
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get worker bookings
exports.getWorkerBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { workerId: req.user.id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ bookingDate: 1 });

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
