// Creating Access Token And Saving In Cookie
const sendToken = (user, statusCode, res, refreshToken=null) => {
    const accessToken = user.getJWTToken();
  
    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
      
    res.status(statusCode).cookie("accessToken", accessToken, options).json({
      success: true,
      user,
      accessToken,
      refreshToken
    });
  };
  
  module.exports = sendToken;
  