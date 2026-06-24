module.exports = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenLife: process.env.JWT_ACCESS_EXPIRESIN,
  refreshTokenLife: process.env.JWT_REFRESH_EXPIRESIN,
};
