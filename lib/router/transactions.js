import { Router } from 'express'
import bodyParser from 'body-parser'
import bunyan from 'bunyan'

export default ({
  authService,
  transactionService,
  log = bunyan({ noop: true })
}) => {
  const router = Router({mergeParams: true});
  router.use(bodyParser.json());

  router.post('/', authService.isAdmin(), async (req, res, next) => {
    try {
      log.warn('router start')
      const fakeTransactions = await transactionService._fakeData();
      res.json({ fakeTransactions });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  return router;
}
