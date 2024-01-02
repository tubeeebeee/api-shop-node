const { validationResult } = require("express-validator");
const Product = require("../models/product");
const fs = require("fs");
const path = require("path");

exports.getAllProducts = async (req, res, next) => {
  const keyword = req.query.keyword?.replaceAll("+", " ") || "";

  const currentPage = Number(req.query.page) || 1;
  const pageSize = 5;

  let totalProducts = 0;

  if (!keyword) {
    totalProducts = await Product.find().countDocuments();

    const products = await Product.find()
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    if (!products.length) {
      //err
    }

    return res.status(200).json({
      statusCode: 200,
      data: products,
      totalProducts: totalProducts,
      currentPage: currentPage,
      nextPage: currentPage + 1,
      prevPage: currentPage - 1,
      hasNextPage: pageSize * currentPage < totalProducts,
      hasPrevPage: currentPage > 1,
      lastPage: Math.ceil(totalProducts / pageSize),
    });
  } else {
    totalProducts = await Product.find({
      title: { $regex: keyword.toLowerCase() },
    }).countDocuments();
    const products = await Product.find({
      title: { $regex: keyword.toLowerCase() },
    })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    if (!products.length) {
      //err
    }

    return res.status(200).json({
      statusCode: 200,
      data: products,
      keyword: keyword,
      totalProducts: totalProducts,
      currentPage: currentPage,
      nextPage: currentPage + 1,
      prevPage: currentPage - 1,
      hasNextPage: pageSize * currentPage < totalProducts,
      hasPrevPage: currentPage > 1,
      lastPage: Math.ceil(totalProducts / pageSize),
    });
  }
};

exports.getProduct = async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) {
    //err
  }
  return res.status(200).json({
    statusCode: 200,
    data: product,
  });
};

exports.createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation fail!");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  if (!req.files?.avatar?.length) {
    const err = new Error();
    err.msg = "avatar is not empty!";
    return next({ statusCode: 422, data: [err] });
  }
  const avatarUrl = req.files.avatar[0].path.replace("\\", "/");
  let imageUrls = [];
  if (req.files?.image?.length) {
    for (let img of req.files.image) {
      let imgUrl = img.path.replace("\\", "/");
      imageUrls.push(imgUrl);
    }
  }

  const product = new Product({
    title: req.body.title.toLowerCase(),
    category: req.body.category,
    shortDesc: req.body.shortDesc,
    longDesc: req.body.longDesc,
    price: Number(req.body.price),
    amount: Number(req.body.amount),
    avatar: avatarUrl,
    imageUrls: imageUrls,
  });

  const newProduct = await product.save();

  return res.status(201).json({
    statusCode: 201,
    productId: newProduct._id.toString(),
  });
};

exports.updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation fail!");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) {
    const err = new Error();
    err.msg = "product is not exist!";
    return next({ statusCode: 422, data: [err] });
  }
  product.title = req.body.title;
  product.category = req.body.category;
  product.shortDesc = req.body.shortDesc;
  product.longDesc = req.body.longDesc;
  product.price = req.body.price;
  product.amount = req.body.amount;

  const result = await product.save();
  res.status(200).json({
    statusCode: 200,
    data: result,
  });
};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) {
    const err = new Error("an error occure when delete!");
    err.statusCode = 422;
    next(err);
  }
  clearImage(product.avatar);
  for (let imgUrl of product.imageUrls) {
    clearImage(imgUrl);
  }
  const result = await Product.findByIdAndDelete(productId);
  return res.status(200).json({
    statusCode: 200,
    productId: productId,
  });
};

//ultils
function clearImage(pathStr) {
  const p = path.join(__dirname, "../", pathStr);
  return fs.unlink(p, (err) => {
    console.log(err);
  });
}
