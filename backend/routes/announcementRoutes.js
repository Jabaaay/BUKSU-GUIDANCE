const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createAnnouncement, getAnnouncements, getAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const auth = require('../middleware/auth');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/announcements/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Create announcement with image upload
router.post('/', auth, upload.single('image'), createAnnouncement);

// Get all announcements
router.get('/', getAnnouncements);

// Get single announcement
router.get('/:id', getAnnouncement);

// Update announcement
router.put('/:id', auth, updateAnnouncement);

// Delete announcement
router.delete('/:id', auth, deleteAnnouncement);

module.exports = router;
