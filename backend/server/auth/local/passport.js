var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(username, password, done) {
      var query = { username:username }
      User.findOne(query, function(err, user) {
        if (err) return done(err);
        if (!user) {
          return done(null, false, { message: 'Entered Username is not registered !!!' });
        }
        if (!user.authenticate(password) && user.status === true) {
          return done(null, false, { message: 'This password is InCorrect !!!' });
        } else if (user.status === false){
          return done(null, false, { message: 'Sorry Account is Under Blocked State !!!' });
        } else {
          return done(null, user);
        }
      });
    }
  ));
};

