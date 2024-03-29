import bunyan from 'bunyan'
import { forbidden, unauthorized } from 'boom'
import uuid from 'uuid'

export class AuthService {
  constructor ({
    secret,
    userService,
    passportUtil,
    reqId = uuid(),
    log = bunyan({ noop: true })
  } = {}) {
    this.log = log.child({service: 'local-passport', reqId})
    this.secret = secret
    this.userService = userService

    // initialize passport strategies
    passportUtil.setupStrategies()
  }

  isAuthenticated () {
    return async (req, res, next) => {
      try {
        const { user } = await this.userService.validateToken(req.headers.authorization);

        if (user) {
          req.user = user;
          next();
        } else {
          throw unauthorized('Unauthorized! invalid token');
        }
      } catch (error) {
        this.log.error(error);
        next(error);
      }
    }
  }

  isAdmin () {
    return async (req, res, next) => {
      try {
        this.isAuthenticated()(req, res, err => {
          if (err) return next(err);

          if (req.user.role && req.user.role.toLowerCase() === 'admin') {
            next();
          } else {
            next(forbidden('You are not authorized to access this route'));
          }
        })
      } catch (error) {
        this.log.error(error);
        next(error);
      }
    }
  }
}

export default options => new AuthService(options)
