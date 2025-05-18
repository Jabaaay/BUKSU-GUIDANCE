const Appointment = require('../models/Appointment');
const User = require('../models/User');

const appointmentController = {
  // Create new appointment
  createAppointment: async (req, res) => {
    try {
      const { type, purpose, date, time } = req.body;
      const userId = req.user.id;

      console.log('Creating appointment for user:', userId);
      console.log('Appointment data:', { type, purpose, date, time });

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        console.log('User not found:', userId);
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if date is in the past
      const appointmentDate = new Date(date);
      const now = new Date();
      if (appointmentDate < now) {
        console.log('Cannot schedule past appointment:', date);
        return res.status(400).json({ message: 'Cannot schedule past appointments' });
      }

      // Create appointment
      const appointment = new Appointment({
        user: userId,
        type,
        purpose,
        date: appointmentDate,
        time,
        college: user.college,
        course: user.course,
        name: user.firstName + ' ' + user.lastName
      });

      await appointment.save();
      console.log('Appointment created successfully:', appointment._id);

      res.status(201).json({
        message: 'Appointment created successfully',
        appointment
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(400).json({ message: error.message });
    }
  },

  // Get user's appointments
  getUserAppointments: async (req, res) => {
    try {
      const userId = req.user.id;
      console.log('Fetching appointments for user:', userId);

      const appointments = await Appointment.find({ user: userId })
        .populate('user', 'firstName lastName email college course name')
        .sort({ date: 1 });

      console.log('Found appointments:', appointments.length);
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Update appointment
  updateAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userId = req.user.id;

      console.log('Updating appointment:', id);
      console.log('Updates:', updates);

      // Find appointment and check if it belongs to user
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        console.log('Appointment not found:', id);
        return res.status(404).json({ message: 'Appointment not found' });
      }

      if (String(appointment.user) !== userId) {
        console.log('Unauthorized update attempt for appointment:', id);
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Update appointment
      Object.assign(appointment, updates);
      await appointment.save();
      console.log('Appointment updated successfully:', id);

      res.json({
        message: 'Appointment updated successfully',
        appointment
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(400).json({ message: error.message });
    }
  },

  // Cancel appointment
  cancelAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      console.log('Cancelling appointment:', id);

      // Find appointment and check if it belongs to user
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        console.log('Appointment not found:', id);
        return res.status(404).json({ message: 'Appointment not found' });
      }

      if (String(appointment.user) !== userId) {
        console.log('Unauthorized cancel attempt for appointment:', id);
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Update status to cancelled
      appointment.status = 'cancelled';
      appointment.notes = 'Cancelled by user';
      await appointment.save();
      console.log('Appointment cancelled successfully:', id);

      res.json({
        message: 'Appointment cancelled successfully',
        appointment
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      res.status(400).json({ message: error.message });
    }
  },

  // Get all appointments for admin
  getAdminAppointments: async (req, res) => {
    try {
      const appointments = await Appointment.find()
        .populate('user', 'firstName lastName email college course name')
        .sort({ date: -1 });

      res.json(appointments);
    } catch (error) {
      console.error('Error getting admin appointments:', error);
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  // Accept appointment
  acceptAppointment: async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id);
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      if (appointment.status !== 'pending') {
        return res.status(400).json({ message: 'Appointment is already processed' });
      }

      appointment.status = 'confirmed';
      await appointment.save();

      res.json({ message: 'Appointment accepted successfully' });
    } catch (error) {
      console.error('Error accepting appointment:', error);
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  // Reject appointment
  rejectAppointment: async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id);
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      if (appointment.status !== 'pending') {
        return res.status(400).json({ message: 'Appointment is already processed' });
      }

      appointment.status = 'rejected';
      await appointment.save();

      res.json({ message: 'Appointment rejected successfully' });
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  }
};

module.exports = appointmentController;
