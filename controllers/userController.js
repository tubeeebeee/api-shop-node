const User = require("../models/user");

exports.getUserById = async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) {
    //err
  }
  const user = await User.findById(userId).select("email fullname phone -_id");

  res.json({
    statusCode: 200,
    data: user,
  });
};
