import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';
import { Strategy as GoogleTokenStrategy } from 'passport-google-token';
import User from './models/User.js';

passport.use(new FacebookTokenStrategy({
  clientID: '599879425305048',
  clientSecret: process.env.FACEBOOK_APP_SECRET
}, async (accessToken, refreshToken, profile, done) => {
  
  try {
    const {email} = profile._json;
    let user = await User.findOne({email});
    if (user) {
      done(null, user);
    } else {
      user = new User({email});
      await user.save();
      done(null, user);
    }
  } catch (err) {
    done(err, false, err.message);
  }
}));

passport.use(new GoogleTokenStrategy({
  clientID: '764637492527-ipbna7b0ig65url663gpdbnqsc0gkhec.apps.googleusercontent.com',
  clientSecret: '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'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const {email} = profile._json;
    let user = await User.findOne({email});
    if (user) {
      done(null, user);
    } else {
      user = new User({email});
      await user.save();
      done(null, user);
    }
  } catch (err) {
    done(err, false, err.message);
  }
}));