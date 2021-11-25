const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  items: {
    type: [
      {
        productId: String,
        name: String,
        price: Number,
        category: String,
        description: String,
        image: String,
        total: Number,
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
