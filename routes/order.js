const express = require("express");
const orderController = require("../controllers/orderController");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/orders",
  [
    body("infoUser.fullname")
      .trim()
      .notEmpty()
      .withMessage("fullname is not empty"),
    body("infoUser.email").isEmail().withMessage("email is not valid!"),
    body("infoUser.address")
      .trim()
      .notEmpty()
      .withMessage("address is not empty"),
    body("infoUser.phone")
      .trim()
      .isMobilePhone("vi-VN")
      .withMessage("phone is not valid!"),
  ],
  orderController.createOrder
);
router.get("/latest-orders", orderController.getLatestOrder);
router.get("/orders/users/:id", orderController.getOrderByUserId);
router.get("/orders/:id", orderController.getOrderById);

router.get("/sumary", orderController.getSummary);

module.exports = router;
