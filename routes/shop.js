const express = require("express");
const shopController = require("../controllers/shopController");

const router = express.Router();

router.get("/shop/products", shopController.getAllProducts);
router.get("/shop/products/:category", shopController.getAllProductsByCategory);
router.get("/shop/product/:id", shopController.getProduct);
router.get("/shop/products/relate/:category", shopController.getRelateProducts);
router.get("/shop/featureProduct", shopController.getFeatureProduct);

module.exports = router;
