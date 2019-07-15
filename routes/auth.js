var express = require('express');
var router = express.Router();
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = (passport, User) => {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({where: {id: id}}).then(function (err, user) {
            done(err, user);
        });
    });

    //Google Authentication
    passport.use(new GoogleStrategy({
            clientID: process.env.googleID,
            clientSecret: process.env.googleSecret,
            callbackURL: "https://localhost:3000/login/google/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOrCreate({
                where: {
                    user_id: profile.id
                },
                defaults: {
                    api_token: Math.random().toString(36).replace('0.', '')
                }
            }).then(([user, created]) => {
                return done(null, user);
            });
        }
    ));

    router.get('/google', passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login']
    }));

    //TODO add redirect query param
    router.get('/google/callback', passport.authenticate('google', {
            failureRedirect: '/',
            failureFlash: true
        }),
        function (req, res) {
            console.log(req.session);
            res.redirect('/');
        }
    );

    //Implement config for SAML Auth
    // passport.use(new SamlStrategy({
    //         path: '/login/saml/callback',
    //         entryPoint: '',
    //         issuer: 'passport-saml'
    //     },
    //     function (profile, done) {
    //         console.log(profile);
    //         return done(null, profile);
    //     }
    // ));

    // router.post('/saml/callback', passport.authenticate('saml', {
    //     failureredirect: '/',
    //     failureFlash: true
    // }), (req, res) => {
    //     res.redirect('/');
    // });

    // app.get('/saml', passport.authenticate('saml', {
    //     failureRedirect: '/',
    //     failureFlash: true
    // }), (req, res) => {
    //     res.redirect('/');
    // });

    return router;
}