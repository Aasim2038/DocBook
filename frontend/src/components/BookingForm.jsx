import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './BookingForm.css'; // Design file hum next step me banayenge

const BookingForm = () => {
  const [date, setDate] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [message, setMessage] = useState("");

  // Slots ki list (Tum change kar sakte ho)
  const slots = ["10:00 AM", "11:00 AM", "12:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  // 1. Jab Date badle, to check karo backend se ki kon se slots booked hain
  useEffect(() => {
    const fetchSlots = async () => {
      // Date ko sahi format me convert karo (YYYY-MM-DD)
      const dateString = date.toLocaleDateString('en-CA'); 
      try {
        // Backend API call
        const res = await axios.get(`http://docbook-api.onrender.com/api/bookings/check-slots/${dateString}`);
        setBookedSlots(res.data); // Booked slots ki list save karo
        setSelectedSlot(null); // Purana selection hata do
        setMessage("");
      } catch (err) {
        console.error("Error fetching slots", err);
      }
    };
    fetchSlots();
  }, [date]);

  // 2. Booking Save karna
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !form.name || !form.phone) {
      alert("Please fill all details!");
      return;
    }

    const dateString = date.toLocaleDateString('en-CA');

    try {
      await axios.post('http://docbook-api.onrender.com/api/bookings/book', {
        patientName: form.name,
        phone: form.phone,
        date: dateString,
        timeSlot: selectedSlot
      });
      
      setMessage("✅ Appointment Booked Successfully!");
      setBookedSlots([...bookedSlots, selectedSlot]); // List update karo taaki turant red ho jaye
      setForm({ name: '', phone: '' });
      setSelectedSlot(null);
    } catch (err) {
      alert("Booking Failed! Maybe slot was taken just now.");
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h2>📅 Book Your Appointment</h2>
        
        {/* Calendar Section */}
        <div className="calendar-wrapper">
          <Calendar onChange={setDate} value={date} minDate={new Date()} />
        </div>

        {/* Slots Section */}
        <div className="slots-wrapper">
          <p>Available Slots for <strong>{date.toDateString()}</strong></p>
          <div className="slots-grid">
            {slots.map(slot => (
              <button 
                key={slot}
                className={`slot-btn ${bookedSlots.includes(slot) ? 'booked' : selectedSlot === slot ? 'selected' : ''}`}
                onClick={() => !bookedSlots.includes(slot) && setSelectedSlot(slot)}
                disabled={bookedSlots.includes(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Form Section */}
        {selectedSlot && (
          <form onSubmit={handleSubmit} className="booking-form">
            <h3>Book for {selectedSlot}</h3>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              required 
            />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              value={form.phone} 
              onChange={e => setForm({...form, phone: e.target.value})} 
              required 
            />
            <button type="submit" className="confirm-btn">Confirm Booking</button>
          </form>
        )}

        {message && <p className="success-msg">{message}</p>}
      </div>
    </div>
  );
};

export default BookingForm;