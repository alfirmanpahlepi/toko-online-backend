const User = require("../models/user");
const useAuth = require("../hooks/useAuth");

exports.getUser = async (req, res) => {
  const { error, claims } = useAuth(req.cookies?.jwt);

  if (error) return res.status(error.status).json({ error: error.message });

  try {
    const user = await User.findOne({ _id: claims._id });

    const { password, ...data } = await user.toJSON();

    res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "something went wrong", e });
  }
};

exports.updateUser = async (req, res) => {
  const { name, address, number } = req.body;

  if (!name || !address || !number)
    return res.status(400).json({ error: "bad request" });

  if (!address.district || !address.city || !address.province)
    return res.status(400).json({ error: "bad request" });

  const { error, claims } = useAuth(req.cookies?.jwt);

  if (error) return res.status(error.status).json({ error: error.message });

  try {
    const user = await User.findOne({ _id: claims._id });

    user.name = name;
    user.number = number;
    user.address = address;

    const updatedUser = await user.save();

    const { password, ...data } = await updatedUser.toJSON();

    res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "something went wrong", e });
  }
};
