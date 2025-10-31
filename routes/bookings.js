// routes/bookings.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingsController');

// REST endpoints
router.get('/', controller.getAllBookings); // GET /api/bookings
router.post('/', controller.createBooking); // POST /api/bookings
router.get('/search', controller.searchByEmail); // GET /api/bookings/search?email=xyz
router.get('/filter', controller.filterByEvent); // GET /api/bookings/filter?event=Synergia
router.get('/:id', controller.getBookingById); // GET /api/bookings/:id
router.put('/:id', controller.updateBooking); // PUT /api/bookings/:id
router.delete('/:id', controller.deleteBooking); // DELETE /api/bookings/:id

module.exports = router;
