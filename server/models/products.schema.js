const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        entity: 'Product',
        name: { type: String, required: true },
        authors: [{ type: Schema.Types.ObjectId, ref: 'Authors' }],
        cover_image: {
            url: { type: String, required: true },
        },
        summary: {
            excerpt: { type: String, required: true, max: 50 },
            text: { type: String, required: true, max: 100 },
        },
        ratings: {
            average: { type: Number },
            reviews: [{ type: Schema.Types.ObjectId, ref: 'Reviews' }],
            voter_count: { type: Number },
            weekly: {
                voter_count: { type: Number },
                value: { type: Number }, // Based on this value render the BOOK OF THE WEEK
            },
        },
        external_url: {
            // This will be the Amazon, Flipkart link
            url: { type: String, required: true },
        },
        genre: [{ type: Schema.Types.ObjectId, ref: 'Genres' }], // Only select id & name to be populated
        pages: { type: Number },
        price: {
            retail: { type: Number },
            discounted: { type: Number }, // (in percentage) calculated the discounted price prior to saving to DB
            // wholesale: { type: Number },
            currency: { type: String, default: 'INR' },
            coupon_codes: [{ type: Schema.Types.ObjectId, ref: 'CouponCodes' }],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Products', productSchema);
