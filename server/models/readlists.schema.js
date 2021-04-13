const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const readlistSchema = new Schema(
    {
        entity: { type: String, required: true, default: 'Readlist' },
        name: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'Users' },
        data: [{ type: Schema.Types.ObjectId, ref: 'Products' }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Readlists', readlistSchema);
