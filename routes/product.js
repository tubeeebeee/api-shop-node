const express = require("express");
const productController = require("../controllers/productController");
const { body } = require("express-validator");
const isAuth = require("../middlequare/is-auth");
const isAdmin = require("../middlequare/is-admin");

const router = express.Router();

router.post(
  "/products",
  [
    body("title").trim().notEmpty().withMessage("title is not empty!"),
    body("shortDesc")
      .trim()
      .notEmpty()
      .withMessage("short description is not empty!"),
    body("longDesc")
      .trim()
      .notEmpty()
      .withMessage("long description is not empty!"),
    body("price").trim().notEmpty().withMessage("price is not empty!"),
    body("amount").trim().notEmpty().withMessage("amount is not empty!"),
  ],
  productController.createProduct
);

router.get("/products", productController.getAllProducts);

router.get("/products/:id", productController.getProduct);

router.delete("/products/:id", productController.deleteProduct);

router.put(
  "/products/:id",
  [
    body("title").trim().notEmpty().withMessage("title is not empty!"),
    body("shortDesc")
      .trim()
      .notEmpty()
      .withMessage("short description is not empty!"),
    body("longDesc")
      .trim()
      .notEmpty()
      .withMessage("long description is not empty!"),
    body("price").trim().notEmpty().withMessage("price is not empty!"),
    body("amount").trim().notEmpty().withMessage("amount is not empty!"),
  ],
  productController.updateProduct
);

module.exports = router;
