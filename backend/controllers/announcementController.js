const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/announcements/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Create announcement
exports.createAnnouncement = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        // If image is uploaded
        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/announcements/${req.file.filename}`;
        }

        const announcement = new Announcement({
            title,
            content,
            author: req.user.id,
            image: imagePath
        });

        await announcement.save();
        res.status(201).json(announcement);
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get all announcements
exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .populate('author', 'email role')
            .sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get single announcement
exports.getAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id)
            .populate('author', 'email role');
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        res.json(announcement);
    } catch (error) {
        console.error('Error fetching announcement:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update announcement
exports.updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        // Check if user is authorized to update
        if (announcement.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this announcement' });
        }

        // Handle image upload if new image is provided
        let imagePath = announcement.image;
        if (req.file) {
            imagePath = `/uploads/announcements/${req.file.filename}`;
        }

        // Update announcement fields
        announcement.title = req.body.title || announcement.title;
        announcement.content = req.body.content || announcement.content;
        announcement.image = imagePath;
        announcement.updatedAt = Date.now();

        await announcement.save();
        res.json(announcement);
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        // Check if user is authorized to delete
        if (announcement.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this announcement' });
        }

        // Delete the announcement
        await announcement.deleteOne();
        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: error.message });
    }
};
