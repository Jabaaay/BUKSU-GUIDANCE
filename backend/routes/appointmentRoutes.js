const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

// Admin routes
router.get('/admin', auth, appointmentController.getAdminAppointments);
router.put('/:id/accept', auth, appointmentController.acceptAppointment);
router.put('/:id/reject', auth, appointmentController.rejectAppointment);

// User routes
router.get('/', auth, appointmentController.getUserAppointments);
router.post('/', auth, appointmentController.createAppointment);
router.put('/:id', auth, appointmentController.updateAppointment);
router.delete('/:id', auth, appointmentController.deleteAppointment);  // Updated to use deleteAppointment

module.exports = router;
