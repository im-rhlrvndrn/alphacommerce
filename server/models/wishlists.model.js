const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema(
    {
        entity: { type: String, required: true, default: 'Wishlist' },
        name: { type: String, required: true },
        cover_image: {
            url: { type: String },
        },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        data: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
        estimated_price: { type: Number },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);
