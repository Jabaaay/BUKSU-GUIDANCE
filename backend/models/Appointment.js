const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['individual', 'group'],
    required: true
  },
  purpose: {
    type: String,
    enum: ['Academic Counseling', 'Emotional Support', 'Career Guidance', 'Behavioral Concerns'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  termsAccepted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure date is always a weekday
appointmentSchema.pre('save', function(next) {
  const day = this.date.getDay();
  if (day === 0 || day === 6) {
    this.status = 'rejected';
    this.notes = 'Cannot schedule on weekends';
  }
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
