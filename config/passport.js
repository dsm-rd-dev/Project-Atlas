const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./config.json');

module.exports = (passport, db) => {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log('Authenticate called');
        db.User.findOne({where: {username: jwt_payload.username}, include: [{model: db.Role}]}).then(user => {
            if(user == null) return done(null, false);
            return done(null, user);
        }).catch(err => {
            console.log(err);
            return done(err, false);
        });
    }));
}