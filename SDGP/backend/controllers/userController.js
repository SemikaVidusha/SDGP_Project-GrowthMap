const User = require('../models/User');

// Public default settings for MVP demo - no auth/DB required
exports.getSettings = async (req, res) => {
    try {
        // Return default settings immediately (no user required)
        res.json({
            darkMode: false,
            emailNotifications: true,
            twoFactorAuth: false,
            language: 'English',
            theme: 'light'
        });
    } catch (err) {
        console.error("Error fetching settings:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const settingsUpdates = req.body;
        
        // For demo, just echo back (no persistent save)
        res.json({
            ...settingsUpdates,
            message: 'Settings updated (demo mode)'
        });
    } catch (err) {
        console.error("Error updating settings:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        // Demo mode - no deletion
        res.status(405).json({ message: 'Profile deletion disabled for demo' });
    } catch (err) {
        console.error("Error deleting user:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

