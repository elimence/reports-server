import uuid from 'uuid'
import request from 'request-promise'

import mongoose from 'mongoose'
import { createErrorResolver } from '../utils'
import bunyan from 'bunyan'

import {
  badRequest,
  boomify,
  unauthorized,
  notFound
} from 'boom'

const { ValidationError } = mongoose.Error
const errorResolver = createErrorResolver({})

export class ReportService {
  constructor ({
    reqId = uuid(),
    transactionService,
    log = bunyan({ noop: true })
  } = {}) {
    this.transactionService = transactionService;
    this.log = log.child({ service: 'report-service', reqId });
  }


  async getReport({ start, end }) {
    try {

    } catch (ex) {
      this.log.info('error fetching reports', ex);
      throw boomify(ex);
    }
  }
}

export default options => new ReportService(options)
