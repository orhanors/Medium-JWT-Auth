module.exports = {
	jwtSecret: process.env.JWT_SECRET,
	jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
	jwtExpire: process.env.JWT_EXPIRE,
	liveUrl: process.env.LIVE_FE_URL,
};
