/**
 * Cấu hình Passport Google OAuth 2.0
 * Yêu cầu env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BACKEND_URL
 *
 * Strategy được khởi tạo lazy (khi route /google được gọi lần đầu)
 * để đảm bảo dotenv đã load xong trước khi đọc env vars.
 */
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

let strategyRegistered = false;

export const initGoogleStrategy = () => {
  if (strategyRegistered) return;

  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientID || !clientSecret) {
    console.warn('⚠️  GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET chưa được cấu hình. Google OAuth sẽ không hoạt động.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(null, false, { message: 'Không lấy được email từ Google' });

          // Tìm user đã có googleId
          let user = await User.findOne({ googleId: profile.id });
          if (user) return done(null, user);

          // Tìm user theo email
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            if (!user.avatar && profile.photos?.[0]?.value) {
              user.avatar = profile.photos[0].value;
            }
            await user.save();
            return done(null, user);
          }

          // Tạo tài khoản mới từ Google
          user = new User({
            fullName: profile.displayName || email.split('@')[0],
            email,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || null,
            role: 'user',
            isVerified: true,
          });
          await user.save();
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  strategyRegistered = true;
  console.log('✅ Google OAuth strategy đã được khởi tạo');
};

export default passport;