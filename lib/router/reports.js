import { Router } from 'express'
import bodyParser from 'body-parser'
import stringify from 'csv-stringify';
import bunyan from 'bunyan'

export default ({
  authService,
  reportService,
  log = bunyan({ noop: true })
}) => {
  const router = Router({mergeParams: true})
  router.use(bodyParser.json());

  router.get('/', authService.isAdmin(), async (req, res, next) => {
    try {
      const { startDate, endDate, type } = req.query;
      const report = await reportService.getReport({ startDate, endDate, type });

      res.json({ report });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.get('/monthly', /*authService.isAdmin(),*/ async (req, res, next) => {
    try {
      const { type } = req.query;
      const { columns, reportData } = await reportService.getMonthlyReport({ type });

      if (type === 'csv') {
        res
          .header('Content-Type', 'text/csv')
          .header('Content-Disposition', 'attachment; filename=\"' + 'report-' + Date.now() + '.csv\"')
          .header('Cache-Control', 'no-cache')
          .header('Pragma', 'no-cache')
        ;

        stringify(reportData, { header: true, columns: columns }).pipe(res);
      } else {
        res.json({ reportData });
      }

    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  return router;
}
