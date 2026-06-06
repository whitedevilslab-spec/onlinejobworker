const Worker = require('../models/Worker');
const User = require('../models/User');
const Review = require('../models/Review');

// Register as Worker
exports.registerWorker = async (req, res) => {
  try {
    const { serviceType, experience, hourlyRate, about, skills } = req.body;

    if (!serviceType || !experience || !hourlyRate) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if worker already exists
    let worker = await Worker.findOne({ userId: req.user.id });
    if (worker) {
      return res.status(400).json({ message: 'Worker profile already exists' });
    }

    // Update user role
    await User.findByIdAndUpdate(req.user.id, { role: 'worker' });

    // Create worker
    worker = new Worker({
      userId: req.user.id,
      serviceType,
      experience,
      hourlyRate,
      about,
      skills: skills || [],
      verified: false,
    });

    await worker.save();

    res.status(201).json({
      success: true,
      message: 'Worker profile created successfully',
      worker,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Workers
exports.getWorkers = async (req, res) => {
  try {
    const { serviceType, verified, page = 1, limit = 10, minRating = 0 } = req.query;

    const query = { verified: verified === 'true' };
    if (serviceType) query.serviceType = serviceType;
    if (minRating) query.rating = { $gte: minRating };

    const workers = await Worker.find(query)
      .populate('userId', 'name email phone profileImage')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    const total = await Worker.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      page,
      workers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Worker Details
exports.getWorkerDetails = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate(
      'userId',
      'name email phone profileImage address city'
    );

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    const reviews = await Review.find({ workerId: req.params.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      worker,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Worker Profile
exports.updateWorkerProfile = async (req, res) => {
  try {
    const { experience, hourlyRate, about, skills, availability } = req.body;

    const worker = await Worker.findOneAndUpdate(
      { userId: req.user.id },
      {
        experience,
        hourlyRate,
        about,
        skills,
        availability,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      worker,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search Workers
exports.searchWorkers = async (req, res) => {
  try {
    const { query, serviceType, city, page = 1, limit = 10 } = req.query;

    const searchQuery = { verified: true };
    if (serviceType) searchQuery.serviceType = serviceType;

    const workers = await Worker.find(searchQuery)
      .populate('userId', 'name email phone profileImage address city')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      workers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
