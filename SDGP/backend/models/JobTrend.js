const mongoose = require('mongoose');

const jobTrendSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    demand: {
        type: Number,
        required: true,
        min: 0,
    },
    date: {
        type: Date,
        required: true,
        index: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

jobTrendSchema.index(
    { title: 1, date: 1 },
    {
        unique: true,
        partialFilterExpression: { date: { $type: 'date' } },
    }
);

module.exports = mongoose.model('JobTrend', jobTrendSchema);