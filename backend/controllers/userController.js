const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");



// Register a new User
exports.registerUser = catchAsyncErrors(async (req, res, next) => { 
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      url: "https://www.linkpicture.com/q/WhatsApp-Image-2023-02-10-at-1.31.24-PM.jpeg",
    },
  });
  //Generate Refresh token and Access token 
  let refreshToken = await RefreshToken.createToken(user);
  sendToken(user, 201, res, refreshToken);
});


// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both
  if(!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  //Selecting password fileds also as it will not include byDefault 
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  let refreshToken = await RefreshToken.createToken(user);
  sendToken(user, 200, res, refreshToken);
});


// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("accessToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  return res.redirect('/login');
});



//Generate new token 
exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;  
    if(requestToken == null) {
      return res.status(403).json({ message: "Refresh Token is required!" });
    }
  
    try {
      let refreshToken = await RefreshToken.findOne({ token: requestToken });
  
      if(!refreshToken) {
        res.status(403).json({ message: "Refresh token is not in the database!" });
        return;
      }
  
      if(RefreshToken.verifyExpiration(refreshToken)) {
        //By default, the returned document does not include the modifications made on the update.
        RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
        
        res.status(403).json({
          message: "Refresh token was expired. Please make a new login request",
        });
        return;
      }

      const user = await User.findById(refreshToken.user._id);
      sendToken(user, 200, res, refreshToken.token);
      
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  };



  // Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User not found", 200));
  }
  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  
  }catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHander(error.message, 500));
  }
});


// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});