const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

/**
 * ===================
 * Session
 * ===================
 */

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser((_id, done) =>
    User.findById({ _id }, (err, user) => done(err, user))
);

/**
 * ===================
 * Google Strategy
 * ===================
 */

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

/**
 * ===================
 * Local Strategy
 * ===================
 */

passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ email: username })
            .then((foundUser) => {
                // email not correct
                if (!foundUser || !foundUser.password) return done(null, false);

                bcrypt.compare(password, foundUser.password, (err, correct) => {
                    // password not corrct
                    if (err) return done(err);
                    if (!correct) return done(null, false);

                    return done(null, foundUser);
                });
            })
            .catch((err) => done(err));
    })
);
