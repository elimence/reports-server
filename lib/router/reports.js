import { Router } from 'express'
import bodyParser from 'body-parser'
import bunyan from 'bunyan'

export default ({
  authService,
  reportService,
  log = bunyan({ noop: true })
}) => {
  const router = Router({mergeParams: true})
  router.use(bodyParser.json());

  router.get('/', authService.isAuthenticated(), async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.getReport({ startDate, endDate });

      res.download(report);
    } catch (e) {
      log.error(e);
      next(e);
    }
  })

  return router;
}
