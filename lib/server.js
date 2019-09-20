import path from 'path';
import cors from 'cors';

import express from 'express';
import bunyan from 'bunyan';

import {
  createDbService,
  TransactionModel,
  UserModel
} from './db';

import {
  createAuthService,
  createUserService,
  createReportService,
  createTransactionService
} from './services';

import { createPassportUtility } from './utils';
import createRouter from './router';

export default ({
  log = bunyan({ name: 'Report Server', noop: true }),
  pkg = {},
  secret,
  mongo,
  apiBase
} = {}) => {
  const app = express()
  if (!secret) throw new Error('App Secret Missing!!!')

  // Initialize database
  const dbService = createDbService({ log, mongo })
  dbService.init()

  // Provision dependencies
  const userService = createUserService({ log, secret, apiBase, UserModel });
  const passportUtil = createPassportUtility({ userService, log });
  const authService = createAuthService({ userService, passportUtil, secret, log });
  const transactionService = createTransactionService({ log, TransactionModel, UserModel });
  const reportService = createReportService({ log, transactionService });

  const router = createRouter({
    transactionService,
    reportService,
    userService,
    authService,
    log
  });

  app.use(cors())
  app.get('/', (req, res, next) => { res.json(pkg) })
  app.use('/api/v1', router)

  const onStart = async () => {}

  return {
    server: app,
    onStart
  }
}
