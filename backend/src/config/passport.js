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
    console.warn('⚠️  GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não foi configurado. Google OAuth está desabilitado.');
    strategyRegistered = true; // Marca como registrado mesmo que falhe, para evitar múltiplas warnings
    return false; // Retorna false para indicar que não foi inicializado com sucesso
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
          if (!email) return done(null, false, { message: 'Não foi possível obter o email do Google' });

          // Encontrar usuário com googleId
          let user = await User.findOne({ googleId: profile.id });
          if (user) return done(null, user);

          // Encontrar usuário por email
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            if (!user.avatar && profile.photos?.[0]?.value) {
              user.avatar = profile.photos[0].value;
            }
            await user.save();
            return done(null, user);
          }

          // Criar nova conta a partir do Google
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
  console.log('✅ Estratégia Google OAuth foi inicializada com sucesso');
  return true;
};

export default passport;