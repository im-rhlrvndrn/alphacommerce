const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema(
    {
        entity: { type: String, required: true, default: 'Cart' },
        user: { type: Schema.Types.ObjectId, ref: 'Users' },
        data: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Products' },
                quantity: { type: Number },
                total: { type: Number },
            },
        ],
        checkout: {
            sub_total: { type: Number },
            tax: [{ name: { type: String }, percentage: { type: Number } }],
            total: { type: Number },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Carts', cartSchema);
