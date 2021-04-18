const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema(
    {
        entity: { type: String, required: true, default: 'Cart' },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        data: [
            {
                book: { type: Schema.Types.ObjectId, ref: 'Book' },
                quantity: { type: Number, default: 1 },
                total: { type: Number, default: 0 },
            },
        ],
        checkout: {
            sub_total: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
