const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/forgetpass").post(forgotPassword);
router.route("/logout").get(logout);
router.route("/refreshtoken").post(isAuthenticatedUser, refreshToken);
router.route("/password/reset/:token").put(resetPassword);


router.get('/login', (req, res, next) => {
  req.user = null;
  return res.render('login', {
    user: req.user
  }); 
});

router.get('/register', (req, res, next) => {
	req.user = null;
  return res.render('register', {
    user: req.user
  }); 
});


router.get('/forgetpass', (req, res, next) => {
	req.user = null;
  return res.render('forget', {
    user: req.user
  }); 
});

module.exports = router;
