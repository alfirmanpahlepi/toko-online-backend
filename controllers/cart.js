const Cart = require("../models/cart");
const useAuth = require("../lib/useAuth");

exports.getCartItems = async (req, res) => {
  try {
    const { error, claims } = useAuth(req.cookies?.jwt);

    if (error) return res.status(error.status).json({ message: error.message });

    const userCart = await Cart.findOne({ uid: claims._id });

    res.status(200).json(userCart.items);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};

exports.addCartItem = async (req, res) => {
  if (!req.body.item) return res.status(400).json({ message: "bad request" });

  try {
    const { error, claims } = useAuth(req.cookies?.jwt);

    if (error) return res.status(error.status).json({ message: error.message });

    const userCart = await Cart.findOne({ uid: claims._id });

    const itemIndex = userCart.items.findIndex(
      (el) => el.productId === req.body.item.productId
    );

    itemIndex === -1
      ? userCart.items.push({ ...req.body.item, total: 1 })
      : userCart.items[itemIndex].total++;

    const addedCart = await userCart.save();

    const data = await addedCart.toJSON();

    res.status(200).json(data.items);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};

exports.removeCartItem = async (req, res) => {
  if (!req.body.productId) return res.status(400).json({ message: "bad request" });

  try {
    const { error, claims } = useAuth(req.cookies?.jwt);

    if (error) return res.status(error.status).json({ message: error.message });

    const userCart = await Cart.findOne({ uid: claims._id });

    const targetIndex = userCart.items.findIndex(
      (item) => item.productId == req.body.productId
    );

    if (targetIndex === -1)
      return res.status(404).json({ message: "item not found" });

    userCart.items[targetIndex].total === 1
      ? userCart.items.splice(targetIndex, 1)
      : userCart.items[targetIndex].total--;
    const removedCart = await userCart.save();

    const data = await removedCart.toJSON();

    res.status(200).json(data.items);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};
