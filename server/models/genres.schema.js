const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genreSchema = new Schema({
    entity: { type: String, required: true, default: 'Genre' },
    books: [{ type: Schema.Types.ObjectId, ref: 'Products' }],
    name: { type: String, required: true },
});

module.exports = mongoose.model('Genres', genreSchema);
