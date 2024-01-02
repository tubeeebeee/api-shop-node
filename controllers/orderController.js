const { validationResult } = require("express-validator");
const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

// 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

exports.getLatestOrder = async (req, res, next) => {
  let query = Order.find();

  query = query.limit(5);

  const latestOrders = await query;

  res.status(200).json({
    statusCode: 200,
    orders: latestOrders,
  });
};

exports.createOrder = async (req, res, next) => {
  const infoUser = req.body.infoUser;
  const buyedItems = req.body.buyedItems;
  const cart = buyedItems.itemsOrigin;

  const errors = validationResult(req).array();
  if (errors && errors.length) {
    return res.status(400).json({
      statusCode: 400,
      errors,
    });
  }

  const newOrder = new Order({
    name: infoUser.fullname,
    email: infoUser.email,
    phone: infoUser.phone,
    address: infoUser.address,
    userId: infoUser.userId,
    total: buyedItems.totalPrice,
    buyItems: buyedItems.items,
  });

  const result = await newOrder.save();

  for (let item of buyedItems.items) {
    const product = await Product.findById(item.productId);

    if (product) {
      product.amount -= item.quantity;
      if (product.amount < 0) {
        product.amount = 0;
      }
      const saved = await product.save();
    }
  }

  const config = {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 9,
  };

  let htmlProduct = "";
  for (let item of cart) {
    const price = new Intl.NumberFormat("it-IT", config).format(item.price);
    const total = new Intl.NumberFormat("it-IT", config).format(
      item.price * item.quantity
    );
    const imgPath = "http://localhost:5000/" + item.avatar;
    htmlProduct += `
                    <tr>
                      <td style="text-align:center;border: 1px solid black;">${item.title}</td>
                      <td style="text-align:center;border: 1px solid black;"><img style="height:24px; width: 24px; display: block;" src=${imgPath} alt=${item.title} title=${item.title} /></td>
                      <td style="text-align:center;border: 1px solid black;">${price}</td>
                      <td style="text-align:center;border: 1px solid black;">${item.quantity}</td>
                      <td style="text-align:center;border: 1px solid black;">${total}</td>
                    </tr>
                   `;
  }

  const msg = {
    to: infoUser.email,
    from: "nguyentribeee@gmail.com",
    subject: "Order success!",
    text: "Inform user!",
    html: `
            <div>
              <h2 style="margin-bottom: 1rem">Xin chào ${newOrder.name}</h2>
              <p style="margin-bottom: 1rem">Phone: ${newOrder.phone}</p>
              <p style="margin-bottom: 1rem">Address: ${newOrder.address}</p>

              <table style="border: 1px solid black;border-collapse: collapse;width:100%;margin-bottom:1rem">
                <tr>
                  <th style="border: 1px solid black;">Tên sản phẩm</th>
                  <th style="border: 1px solid black;">Hình ảnh</th>
                  <th style="border: 1px solid black;">Giá</th>
                  <th style="border: 1px solid black;">Số lượng</th>
                  <th style="border: 1px solid black;">Thành tiền</th>
                </tr>
                ${htmlProduct}
              </table>

              <h2>Tổng Thanh Toán: </h2>
              <h2 style="margin-bottom: 2rem">${new Intl.NumberFormat(
                "it-IT",
                config
              ).format(newOrder.total)}</h2>

              <h2>Cảm ơn Bạn!</h2>
            </div>
          `,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      return res.json({
        status: "success",
      });
    })
    .catch((error) => {
      console.error(error);
      return res.json({
        status: "success",
      });
    });
};

exports.getOrderByUserId = async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) {
    return res.json({
      statusCode: 400,
      msg: "not found user with this id!",
    });
  }
  const orders = await Order.find({ userId: userId });

  res.json({
    statusCode: 200,
    orders: orders,
  });
};

exports.getOrderById = async (req, res, next) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId)
    .populate("buyItems.productId")
    .exec();

  res.status(200).json({
    statusCode: 200,
    order,
  });
};

exports.getSummary = async (req, res, next) => {
  let queryUser = User.find({ role: "user" });
  queryUser = queryUser.countDocuments();
  const userCount = await queryUser;
  const orderCount = await Order.countDocuments();
  let query = Order.find();
  query = query.select("total -_id");
  let totals = await query;
  const totalPrice = totals
    .map((t) => t.total)
    .reduce((acc, el) => acc + el, 0);
  res.json({
    userCount,
    orderCount,
    totalPrice,
  });
};
