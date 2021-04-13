const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        entity: { type: String, required: true, default: 'Comment' },
        user: { type: Schema.Types.ObjectId, ref: 'Users' },
        message: { type: String },
        replies: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Comments', commentSchema);
