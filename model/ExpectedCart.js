const mongoose = require('mongoose');

const expectedPriceCart = new mongoose.Schema({
    phone: { type: String, required: true },
    id: { type: Number, required: true },
    expectedPrice: { type: Number, required: true },
});

module.exports = mongoose.model('ExpectedPriceCart', expectedPriceCart);
