import passport from 'passport';

export default {
  withUser,
  required,
  hasRole
};

/** unauthorized()
 * Sends a 401 error code and calls next() with the error
 */
export function unauthorized(res, next) {
  res.status(401).json({ error: 'Not authorized.' });
  return next('Unauthorized');
}

/** withUser()
 * Authenticates a route with passport-jwt (json web token) and adds the authen-
 * ticated user to the `request` object (`req.user`). If the user is
 * unauthorized, this method simply does not set `req.user`. If authorization is
 * required, use the `auth.required` middleware instead.
 *
 */
export function withUser(req, res, next) {
  return passport.authenticate('jwt', { session: false }, function(err, user) {
    if (!err && user) {
      req.login(user, function(err) {
        if (err) { return next(err); }
        return next();
      });
    } else {
      return next();
    }
  })(req, res, next);
}

/** required()
 * Authenticates a route with passport-jwt (json web token) with a custom
 * callback that ensures that the user is authenticated before moving to next().
 */
export function required(req, res, next) {
  return passport.authenticate('jwt', { session: false }, function(err, user) {
    if (err || !user) {
      return unauthorized(res, next);
    }

    req.login(user, function(err) {
      if (err) { return next(err); }
      return next();
    });
  })(req, res, next);
}

/** hasRole()
 * Can specify a role in any route to be required in order to access a route.
 * This method calls required() first in order to first authenticate via
 * JSON web token first.
 */
export function hasRole(role) {
  return function(req, res, next) {
    required(req, res, function() {
      const { user } = req;

      if (!user || !user.hasRole(role)) {
        return unauthorized(res, next);
      }

      return next();
    });
  };
}
