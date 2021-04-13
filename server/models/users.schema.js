const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        entity: { type: String, required: true, default: 'User' },
        full_name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        avatar: {
            url: { type: String },
        },
        readlists: [{ type: Schema.Types.ObjectId, ref: 'Readlists' }],
        cart: { type: Schema.Types.ObjectId, ref: 'Carts' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Users', userSchema);
