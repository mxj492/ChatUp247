var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var db = require("../../models");

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(
  new LocalStrategy(
    // Our user will sign in using an email, rather than a "username"
    {
      usernameField: "email"
    },
    function(email, password, done) {
      // When a user tries to sign in this code runs
      db.User.findOne({
        where: {
          email: email
        }
      }).then(function (dbUser) {
        // If there's no user with the given email
        if (!dbUser) {
          return done(null, false, {
            message: "Incorrect email."
          });
        }
        // If there is a user with the given email, but the password the user gives us is incorrect
        else if (!dbUser.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect password."
          });
        }
        // If none of the above, return the user
        return done(null, dbUser);
      });
    }
  )
);

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;

// var passport = require("passport");
// var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
// var bCrypt = require("bcrypt-nodejs");
// module.exports = function(passport, user) {
//   var User = user;
//   var LocalStrategy = require("passport-local").Strategy;
//   passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });

//   // Use the GoogleStrategy within Passport.
//   //   Strategies in Passport require a `verify` function, which accept
//   //   credentials (in this case, an accessToken, refreshToken, and Google
//   //   profile), and invoke a callback with a user object.
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: GOOGLE_CLIENT_ID,
//         clientSecret: GOOGLE_CLIENT_SECRET,
//         callbackURL: "http://www.example.com/auth/google/callback"
//       },
//       function(accessToken, refreshToken, profile, done) {
//         User.findOrCreate({ googleId: profile.id }, function(err, user) {
//           return done(err, user);
//         });
//       }
//     )
//   );

//   // used to deserialize the user
//   passport.deserializeUser(function(id, done) {
//     User.findById(id).then(function(user) {
//       if (user) {
//         done(null, user.get());
//       } else {
//         done(user.errors, null);
//       }
//     });
//   });
//   passport.use(
//     "local-signup",
//     new LocalStrategy(
//       {
//         usernameField: "email",
//         passwordField: "password",
//         passReqToCallback: true // allows us to pass back the entire request to the callback
//       },
//       function(req, email, password, done) {
//         var generateHash = function(password) {
//           return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
//         };
//         User.findOne({ where: { email: email } }).then(function(user) {
//           if (user) {
//             return done(null, false, {
//               message: "That email is already taken"
//             });
//           } else {
//             var userPassword = generateHash(password);
//             var data = {
//               email: email,
//               password: userPassword,
//               firstname: req.body.firstname,
//               lastname: req.body.lastname
//             };
//             User.create(data).then(function(newUser, created) {
//               if (!newUser) {
//                 return done(null, false);
//               }
//               if (newUser) {
//                 return done(null, newUser);
//               }
//               return created;
//             });
//           }
//         });
//       }
//     )
//   );

//   //LOCAL SIGNIN
//   passport.use(
//     "local-signin",
//     new LocalStrategy(
//       {
//         // by default, local strategy uses username and password, we will override with email
//         usernameField: "email",
//         passwordField: "password",
//         passReqToCallback: true // allows us to pass back the entire request to the callback
//       },
//       function(req, email, password, done) {
//         var User = user;
//         var isValidPassword = function(userpass, password) {
//           return bCrypt.compareSync(password, userpass);
//         };
//         User.findOne({ where: { email: email } })
//           .then(function(user) {
//             if (!user) {
//               return done(null, false, { message: "Email does not exist" });
//             }
//             if (!isValidPassword(user.password, password)) {
//               return done(null, false, { message: "Incorrect password." });
//             }
//             var userinfo = user.get();
//             return done(null, userinfo);
//           })
//           .catch(function(err) {
//             console.log("Error:", err);
//             return done(null, false, {
//               message: "Something went wrong with your Signin"
//             });
//           });
//       }
//     )
//   );
// };

// return passport;
