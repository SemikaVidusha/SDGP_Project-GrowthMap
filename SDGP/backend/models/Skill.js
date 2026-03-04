const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    currentSkills: [String],        
    targetRole: { type: String },    
    quizResults: {                  
        score: Number,
        category: String,
        completedAt: { type: Date, default: Date.now }
    },
    gapAnalysis: {                  
        missingSkills: [String],
        recommendations: [String]
    }
});

module.exports = mongoose.model('Skill', SkillSchema);