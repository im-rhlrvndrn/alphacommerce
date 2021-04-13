const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        entity: { type: String, required: true, default: 'Review' },
        user: { type: Schema.Types.ObjectId, ref: 'Users' },
        comment: { type: Schema.Types.ObjectId, ref: 'Comments' },
        stats: {
            likes_count: { type: Number },
            dislikes_count: { type: Number },
        },
        rating: { type: Number, required: true },
        // replies: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Reviews', reviewSchema);
