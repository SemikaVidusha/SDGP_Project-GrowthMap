const User = require('../models/User');

exports.getSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('settings');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        // If user doesn't have settings yet, return defaults
        res.json(user.settings || {
            darkMode: false,
            emailNotifications: true,
            twoFactorAuth: false,
            language: 'English'
        });
    } catch (err) {
        console.error("Error fetching settings:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const settingsUpdates = req.body;
        
        // Use $set to update specific fields within the settings object
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { settings: settingsUpdates } },
            { new: true, upsert: true }
        ).select('settings');
        
        res.json(user.settings);
    } catch (err) {
        console.error("Error updating settings:", err.message);
        res.status(500).send('Server Error');
    }
};
