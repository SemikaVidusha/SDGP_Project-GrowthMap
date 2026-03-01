const Skill = require('../models/Skill');
const User = require('../models/User');

exports.getUserDashboardData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const skillData = await Skill.findOne({ userId: req.user.id });
        
        res.json({
            user,
            progress: skillData || { msg: "No data found, please complete your profile." }
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.setTargetRole = async (req, res) => {
    try {
        const { role } = req.body;
        let skillEntry = await Skill.findOneAndUpdate(
            { userId: req.user.id },
            { targetRole: role },
            { upsert: true, new: true }
        );
        res.json({ msg: `Target role set to ${role}`, data: skillEntry });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.processSkillGap = async (req, res) => {
    try {
        const { skills, role } = req.body;
        let gapData = await Skill.findOneAndUpdate(
            { userId: req.user.id },
            { currentSkills: skills, targetRole: role },
            { upsert: true, new: true }
        );
        res.json(gapData);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.saveQuizResult = async (req, res) => {
    try {
        const { score, category } = req.body;
        let result = await Skill.findOneAndUpdate(
            { userId: req.user.id },
            { quizResults: { score, category, completedAt: Date.now() } },
            { upsert: true, new: true }
        );
        res.json(result);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const profile = await Skill.findOne({ userId: req.user.id }).populate('userId', ['username', 'email']);
        res.json(profile);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};