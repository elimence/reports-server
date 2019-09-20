import bunyan from 'bunyan';
import createAuthRouter from './auth';
import createUserRouter from './user';
import createBlockRouter from './block';
import { Router } from 'express';

export default ({
  authService,
  userService,
  blockChainService,
  log = bunyan({ noop: true })
}) => {
  const router = Router({ mergeParams: true })

  router.use('/auth', createAuthRouter({
    authService,
    userService,
    log: log.child({ router: 'auth' })
  }))

  router.use('/users', createUserRouter({
    authService,
    userService,
    log: log.child({ router: 'users' })
  }))

  router.use('/blocks', createBlockRouter({
    authService,
    blockChainService,
    log: log.child({ router: 'users' })
  }))

  return router
}
