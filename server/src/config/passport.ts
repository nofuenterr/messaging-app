import { compare } from 'bcryptjs';
import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

export default (pool) => {
  // EXTRACT JWT FROM COOKIE
  const cookieExtractor = (req) => {
    let token = null;

    if (req && req.cookies) {
      token = req.cookies.jwt;
    }

    return token;
  };

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const { rows } = await pool.query(
          'SELECT * FROM users WHERE username = $1 AND deleted IS NULL',
          [username]
        );
        const user = rows[0];

        if (!user) {
          return done(null, false, { message: 'Incorrect username' });
        }

        const match = await compare(password, user.password_hash);

        if (!match) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          const { rows } = await pool.query(
            'SELECT * FROM users WHERE id = $1 AND deleted IS NULL',
            [payload.id]
          );

          const user = rows[0];

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  return passport;
};
