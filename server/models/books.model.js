const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema(
    {
        entity: 'Product',
        name: { type: String, required: true },
        // authors: [{ type: Schema.Types.ObjectId, ref: 'Author' }],
        authors: [{ type: String, required: true }],
        cover_image: {
            url: { type: String, required: true },
        },
        summary: {
            excerpt: { type: String, required: true, max: 50 },
            text: { type: String, required: true, max: 100 },
        },
        ratings: {
            average: { type: Number },
            reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
            voter_count: { type: Number },
            weekly: {
                voter_count: { type: Number },
                value: { type: Number }, // Based on this value render the BOOK OF THE WEEK
            },
        },
        external_urls: {
            // This will be the Amazon, Flipkart link
            amazon: { type: String, required: true },
        },
        genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }], // Only select id & name to be populated
        pages: { type: Number, required: true, default: 0 },
        price: {
            retail: { type: Number },
            discounted: { type: Number }, // (in percentage) calculated the discounted price prior to saving to DB
            // wholesale: { type: Number },
            currency: { type: String, default: 'INR' },
            coupon_codes: [{ type: Schema.Types.ObjectId, ref: 'CouponCode' }],
            tax: [{ name: { type: String }, percentage: { type: Number } }],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
