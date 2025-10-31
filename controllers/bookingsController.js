// controllers/bookingsController.js
const Booking = require('../models/Booking');

// GET /api/bookings
const getAllBookings = async (req, res) => {
  try {
    // Support pagination & sorting if wanted via query params (optional)
    const { page = 1, limit = 100 } = req.query;
    const skip = (Math.max(1, page) - 1) * Math.max(1, limit);

    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { name, email, event, ticketType } = req.body;

    // Validate required fields
    if (!name || !email || !event) {
      return res.status(400).json({ success: false, message: 'name, email and event are required' });
    }

    const booking = new Booking({ name, email, event, ticketType });
    await booking.save();

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.error(err);
    // invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/bookings/:id
const updateBooking = async (req, res) => {
  try {
    const allowed = ['name', 'email', 'event', 'ticketType'];
    const updates = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    }

    // Ensure required fields are not cleared
    if (updates.name === '' || updates.email === '' || updates.event === '') {
      return res.status(400).json({ success: false, message: 'name, email and event cannot be empty' });
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/bookings/:id
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.status(200).json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/bookings/search?email=xyz
const searchByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'email query param is required' });

    // case-insensitive exact match or partial using regex
    const bookings = await Booking.find({
      email: { $regex: email, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/bookings/filter?event=Synergia
const filterByEvent = async (req, res) => {
  try {
    const { event } = req.query;
    if (!event) return res.status(400).json({ success: false, message: 'event query param is required' });

    const bookings = await Booking.find({
      event: { $regex: event, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllBookings,
  createBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
  searchByEmail,
  filterByEvent
};
