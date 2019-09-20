import bunyan from 'bunyan';
import createAuthRouter from './auth';
import createUserRouter from './user';
import createTransactionRouter from './transactions';
import createReportRouter from './reports';
import { Router } from 'express';

export default ({
  authService,
  userService,
  reportService,
  transactionService,
  log = bunyan({ noop: true })
}) => {
  const router = Router({ mergeParams: true });

  router.use('/auth', createAuthRouter({
    authService,
    userService,
    log: log.child({ router: 'auth' })
  }));

  router.use('/users', createUserRouter({
    authService,
    userService,
    log: log.child({ router: 'users' })
  }));

  router.use('/transactions', createTransactionRouter({
    authService,
    transactionService,
    log: log.child({ router: 'users' })
  }));

  router.use('/reports', createReportRouter({
    authService,
    reportService,
    transactionService,
    log: log.child({ router: 'users' })
  }));

  return router;
}
