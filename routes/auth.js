const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const User = require("../models/user");

const router = express.Router();

router.post(
  "/signup",
  [
    body("fullname").trim().notEmpty().withMessage("fullname is not empty"),
    body("email")
      .isEmail()
      .withMessage("email is not valid!")
      .custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          throw new Error("A user already exists with this e-mail address");
        }
      }),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("password length must >= 5"),
    body("phone")
      .trim()
      .isMobilePhone("vi-VN")
      .withMessage("phone is not valid!"),
  ],
  authController.postSignup
);

router.post(
  "/signin",
  [
    body("email")
      .isEmail()
      .withMessage("email is not valid!")
      .custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (!existingUser) {
          throw new Error("a user with email is not found!");
        }
      }),
    body("password").trim().notEmpty().withMessage("password is not empty!"),
  ],
  authController.postSignin
);

router.post(
  "/admin/signin",
  [
    body("email")
      .isEmail()
      .withMessage("email is not valid!")
      .custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (!existingUser) {
          throw new Error("a user with email is not found!");
        }
        if (existingUser.role !== "admin") {
          if (existingUser.role !== "ctv") {
            throw new Error(
              "a user with email is not admin email or ctv email!"
            );
          }
        }
      }),
    body("password").trim().notEmpty().withMessage("password is not empty!"),
  ],
  authController.postSignin
);

router.get("/verifyToken/:token", authController.verifyToken);

module.exports = router;
