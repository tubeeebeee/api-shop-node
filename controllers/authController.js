const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.postSignup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("validation fail!");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;

  const hashPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    email: email,
    fullname: fullname,
    phone: phone,
    password: hashPassword,
  });
  const user = await newUser.save();
  return res.status(201).json({
    message: "User created!",
    userId: user._id,
    statusCode: 201,
  });
};

exports.postSignin = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("validation fail!");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const err = new Error();
    err.msg = "password is incorrect!";
    return next({ statusCode: 422, data: [err] });
  }

  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
      role: user.role,
    },
    "secretkey",
    {
      expiresIn: "1h",
    }
  );

  return res.status(200).json({
    statusCode: 200,
    token: token,
    role: user.role,
    userId: user._id.toString(),
  });
};

exports.verifyToken = async (req, res, next) => {
  const token = req.params.token;
  if (!token) {
    const err = new Error("not authenticated!");
    return res.status(400).json({
      statusCode: 400,
      data: [err],
    });
  }
  let decodeToken;
  try {
    decodeToken = jwt.verify(token, "secretkey");
  } catch (e) {
    const err = new Error("not authenticated!");
    return res.status(400).json({
      statusCode: 400,
      data: [err],
    });
  }
  if (!decodeToken) {
    const err = new Error("not authenticated!");
    return res.status(400).json({
      statusCode: 400,
      data: [err],
    });
  }
  return res.status(200).json({
    statusCode: 200,
    message: "token is verified!",
    role: decodeToken.role,
  });
};
