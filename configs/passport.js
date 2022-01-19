const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user-model");

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser((_id, done) =>
    User.findById({ _id }, (err, user) => done(err, user))
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/redirect",
        },
        // passport callback
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ googleId: profile.id })
                .then((foundUser) => {
                    if (foundUser) done(null, foundUser);
                    else {
                        new User({
                            name: profile.displayName,
                            googleId: profile.id,
                            avatarUrl: profile.photos[0].value,
                            email: profile.emails[0].value,
                        })
                            .save()
                            .then((newUser) => done(null, newUser))
                            .catch((err) => done(err));
                    }
                })
                .catch((err) => done(err));
        }
    )
);
