const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');

router.get('/match/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
      
        const matchedJobs = await Job.find({
            requiredSkills: { $in: user.skills }
        });
        res.json(matchedJobs);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});