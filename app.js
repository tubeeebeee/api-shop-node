const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const shopRoute = require("./routes/shop");
const userRoute = require("./routes/user");
const orderRoute = require("./routes/order");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([
  { name: "image", maxCount: 5 },
  { name: "avatar", maxCount: 1 },
]);

app.use(upload);
app.use(authRoute);
app.use(productRoute);
app.use(shopRoute);
app.use(userRoute);
app.use(orderRoute);

app.use((err, req, res, next) => {
  return res.json(err);
});

mongoose
  .connect(
    "mongodb+srv://hoangminhtubeee:tulaso1@cluster0.mixo8hm.mongodb.net/asm3"
  )
  .then(() => {
    app.listen(5000);
  });
