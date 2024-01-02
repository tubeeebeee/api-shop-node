const Product = require("../models/product");

exports.getAllProducts = async (req, res, next) => {
  const currentPage = Number(req.query.page) || 1;
  const pageSize = 6;
  let totalProducts = 0;

  const keyword = req.query.keyword?.replaceAll("+", " ") || "";
  const order = req.query.order;

  if (!keyword) {
    totalProducts = await Product.find().countDocuments();

    let products = [];

    if (order === "") {
      products = await Product.find()
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    } else if (order === "dec") {
      products = await Product.find()
        .sort({ price: -1, _id: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    } else if (order === "inc") {
      products = await Product.find()
        .sort({ price: 1, _id: 1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    }

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

    let products = [];

    if (order === "") {
      products = await Product.find({
        title: { $regex: keyword.toLowerCase() },
      })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    } else if (order === "dec") {
      products = await Product.find({
        title: { $regex: keyword.toLowerCase() },
      })
        .sort({ price: -1, _id: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    } else if (order === "inc") {
      products = await Product.find({
        title: { $regex: keyword.toLowerCase() },
      })
        .sort({ price: 1, _id: 1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    }

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

exports.getAllProductsByCategory = async (req, res, next) => {
  const currentPage = Number(req.query.page) || 1;
  const pageSize = 6;
  let totalProducts = 0;

  const category = req.params.category;
  const keyword = req.query.keyword?.replaceAll("+", " ") || "";
  const order = req.query.order;

  if (!keyword) {
    totalProducts = await Product.find({ category: category }).countDocuments();

    let products = [];

    if (order === "") {
      products = await Product.find({ category: category })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    } else if (order === "dec") {
      products = await Product.find({ category: category })
        .sort({ price: -1, _id: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    } else if (order === "inc") {
      products = await Product.find({ category: category })
        .sort({ price: 1, _id: 1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    }

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
      category: category,
    }).countDocuments();

    let products = [];

    if (order === "") {
      products = await Product.find({
        title: { $regex: keyword.toLowerCase() },
        category: category,
      })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    } else if (order === "dec") {
      products = await Product.find({
        title: { $regex: keyword.toLowerCase() },
        category: category,
      })
        .sort({ price: -1, _id: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    } else if (order === "inc") {
      products = await Product.find({
        title: { $regex: keyword.toLowerCase() },
        category: category,
      })
        .sort({ price: 1, _id: 1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    }

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
  let query = Product.find({
    category: product.category,
    _id: { $ne: product._id },
  });
  query = query.limit(3);

  const relateProduct = await query;

  return res.status(200).json({
    statusCode: 200,
    data: {
      product,
      relateProduct,
    },
  });
};

exports.getRelateProducts = async (req, res, next) => {
  const category = req.params.category;

  try {
    let query = Product.find({ category: category });
    query = query.limit(3);
    const products = await query;

    console.log(products);

    res.json({
      statusCode: 200,
      data: products,
    });
  } catch (err) {
    //err
  }
};

exports.getFeatureProduct = async (req, res, next) => {
  let query = Product.find();
  const products = await query.limit(8);

  res.json({
    statusCode: 200,
    data: products,
  });
};
