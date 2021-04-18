const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        entity: { type: String, required: true, default: 'User' },
        full_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: {
            url: { type: String },
        },
        cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
        wishlists: [{ type: Schema.Types.ObjectId, ref: 'Wishlist' }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
