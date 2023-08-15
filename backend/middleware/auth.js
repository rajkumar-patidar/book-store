const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { accessToken } = req.cookies;

  if(!accessToken) {
    req.user = null;
    next();
  }else{
    const decodedData = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
  }
  
});


