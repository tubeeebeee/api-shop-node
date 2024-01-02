module.exports = (req, res, next) => {
  console.log(req.role);
  if (!req.role) {
    return res.json({
      statusCode: 401,
    });
  } else {
    if (req.role !== "admin") {
      return res.json({
        statusCode: 401,
      });
    }
  }
  next();
};
