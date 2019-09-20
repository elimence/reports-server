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

export class TransactionService {
  constructor ({
    model,
    reqId = uuid(),
    log = bunyan({ noop: true })
  } = {}) {
    this.model = model;
    this.log = log.child({ service: 'transaction-service', reqId });
  }


  async getForPeriod(date) {
    try {

    } catch (ex) {
      this.log.info('error fetching transactions', ex);
      throw boomify(ex);
    }
  }

  async getForRange({ start, end }) {
    try {

    } catch (ex) {
      this.log.info('error fetching transactions', ex);
      throw boomify(ex);
    }
  }
}

export default options => new TransactionService(options)
