import R from 'ramda'
import { Router } from 'express'
import bodyParser from 'body-parser'
import bunyan from 'bunyan'
import { unauthorized } from 'boom'

export default ({
  authService,
  blockChainService,
  log = bunyan({ noop: true })
}) => {
  const router = Router({mergeParams: true})
  router.use(bodyParser.json())

  router.get('/', authService.isAuthenticated(), async (req, res, next) => {
    try {
      const blocks = await blockChainService.getLatest();

      res.json({ blocks })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.get('/:blockHash', authService.isAuthenticated(), async (req, res, next) => {
    try {
      const { blockHash } = req.params;
      const blockData = await blockChainService.getBlockData({ blockHash })

      res.json({ blockData });
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  return router
}
