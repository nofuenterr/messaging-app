import { compare } from 'bcryptjs';
import type { Request } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, type StrategyOptionsWithoutRequest } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import type { Pool } from 'pg';

export default (pool: Pool) => {
  const cookieExtractor = (req: Request): string | null => {
    if (req?.cookies) {
      return req.cookies.jwt ?? null;
    }
    return null;
  };

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const { rows } = await pool.query(
          'SELECT * FROM users WHERE username = $1 AND deleted IS NULL',
          [username]
        );
        const user = rows[0];

        if (!user) return done(null, false, { message: 'Incorrect username' });

        const match = await compare(password, user.password_hash);
        if (!match) return done(null, false, { message: 'Incorrect password' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  const jwtOptions: StrategyOptionsWithoutRequest = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET as string,
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1 AND deleted IS NULL', [
          payload.id,
        ]);
        const user = rows[0];

        if (!user) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    })
  );

  return passport;
};
