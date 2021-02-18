const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const Author = require("../models").Author;
const { generateTokens } = require("../helpers/jwt");
const {
	generateUserFromGoogle,
	generateUserFromFacebook,
} = require("../helpers/oauthFunctions");
passport.use(
	"google",
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
			clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_REDIRECT_URL,
		},
		async (accessToken, refreshToken, profile, done) => {
			//NOTE: accessToken and refreshToken used for interacting with google. We dont need them

			try {
				const user = await Author.findOne({ googleId: profile.id });

				if (user) {
					const tokens = await generateTokens(user);
					return done(null, { user, tokens });
				}

				const newUser = new Author(generateUserFromGoogle(profile));
				await newUser.save();
				const tokens = await generateTokens(newUser);
				done(null, { user: newUser, tokens });
			} catch (error) {
				console.log("Google passportjs error: ", error);
				done(error, false);
			}
		}
	)
);
passport.use(
	"facebook",
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: process.env.FACEBOOK_REDIRECT_URL,
			profileFields: ["id", "displayName", "photos", "emails", "name"],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const user = await Author.findOne({ facebookId: profile.id });

				if (user) {
					const tokens = await generateTokens(user);
					return done(null, { user, tokens });
				}

				const newUser = new Author(generateUserFromFacebook(profile));
				await newUser.save();
				const tokens = await generateTokens(newUser);
				done(null, { user: newUser, tokens });
			} catch (error) {
				console.log("Facebook passportjs error: ", error);
				done(error, false);
			}
		}
	)
);

passport.serializeUser(function (user, next) {
	next(null, user);
});
