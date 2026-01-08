const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true }, // Format: "2024-02-20"
  timeSlot: { type: String, required: true }, // Format: "10:30 AM"
  status: { type: String, default: "Booked" }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);