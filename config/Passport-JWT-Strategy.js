import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import Users from "../models/Users.js";

function passportJWTStrategy() {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //   TODO: Change and hide the secret key.
    secretOrKey: "secret",
  };

  passport.use(
    new Strategy(opts, (jwt_payload, done) => {
      Users.findOne({ id: jwt_payload.sub }, (error, user) => {
        if (error) return done(error, false);
        else if (user) return done(null, user);
        else return done(null, false);
      });
    })
  );
}

export default passportJWTStrategy;
