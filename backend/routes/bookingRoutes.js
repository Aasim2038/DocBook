const router = require('express').Router();
const Appointment = require('../models/Appointment');

// 1. Check karo ki uss Date par kon-kon se Slots booked hain
router.get('/check-slots/:date', async (req, res) => {
  try {
    const bookings = await Appointment.find({ date: req.params.date });
    // Sirf time slots ki list bhejo (Jaise ["10:00 AM", "11:00 AM"])
    const bookedSlots = bookings.map(b => b.timeSlot);
    res.status(200).json(bookedSlots);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. Nayi Booking Save karo
router.post('/book', async (req, res) => {
  try {
    // Check karo kahi same time par kisi aur ne to book nahi kar liya?
    const existing = await Appointment.findOne({ 
        date: req.body.date, 
        timeSlot: req.body.timeSlot 
    });

    if (existing) {
        return res.status(400).json({ message: "Sorry! This slot is already booked." });
    }

    const newAppointment = new Appointment(req.body);
    const saved = await newAppointment.save();
    res.status(200).json(saved);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;