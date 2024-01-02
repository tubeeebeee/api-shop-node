const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.get("Authorization");
  console.log(header);
  if (!header) {
    const err = new Error("not authenticated!");
    return res.status(400).json({
      statusCode: 400,
      msg: "header dont have token",
    });
  }

  const token = header.split(" ")[1];
  console.log(token);
  let decodeToken;
  try {
    decodeToken = jwt.verify(token, "secretkey");
  } catch (e) {
    const err = new Error("not authenticated!");
    return res.status(400).json({
      statusCode: 400,
      msg: "cant not decode token",
    });
  }
  if (!decodeToken) {
    const err = new Error("not authenticated!");
    return res.status(400).json({
      statusCode: 400,
      msg: "token is dont match",
    });
  }
  req.userId = decodeToken.userId;
  req.role = decodeToken.role;
  next();
};
