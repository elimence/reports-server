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
import { getMaxListeners } from 'cluster'

const { ValidationError } = mongoose.Error
const errorResolver = createErrorResolver({})

export class TransactionService {
  constructor ({
    TransactionModel,
    reqId = uuid(),
    log = bunyan({ noop: true })
  } = {}) {
    this.TransactionModel = TransactionModel;
    this.log = log.child({ service: 'transaction-service', reqId });
  }

  async getForRange ({ start, end }) {
    try {
      const transactions = await this.TransactionModel.find({ 'transactionDate': {'$gte': start, '$lte': end}});
      return transactions;
    } catch (ex) {
      this.log.info('error fetching transactions', ex);
      throw boomify(ex);
    }
  }

  async getForCurrentMonth () {
    try {
      const currentDate = new Date();
      const start = new Date(currentDate.setDate(1)); // first day of month
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // day 0 is last day of previous month

      return this.getForRange({ start, end });
    } catch (ex) {
      this.log.info('error fetching transactions', ex);
      throw boomify(ex);
    }
  }

  async _fakeData() {
    try {
      [
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2019, 09, 1') },
        { amount: 300, user: '5d84788333741c1a882cc5b8', transactionDate: new Date('2019, 09, 4') },
        { amount: 300, user: '5d8478b633741c1a882cc5b9', transactionDate: new Date('2019, 09, 6') },
        { amount: 300, user: '5d84788333741c1a882cc5b8', transactionDate: new Date('2019, 09, 4') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2019, 09, 9') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2019, 09, 19') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2019, 09, 12') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2019, 09, 11') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2019, 09, 14') },
        { amount: 300, user: '5d84788333741c1a882cc5b8', transactionDate: new Date('2019, 09, 2') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2019, 09, 2') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2010, 01') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2010, 01') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2018, 01') },
        { amount: 300, user: '5d84788333741c1a882cc5b8', transactionDate: new Date('2018, 01') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2018, 01') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2018, 01') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2018, 01') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2019, 01') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2019, 01') },
        { amount: 300, user: '5d846fa9f225c8124e7fc2f8', transactionDate: new Date('2019, 01') },
        { amount: 300, user: '5d8478b633741c1a882cc5b9', transactionDate: new Date('2019, 01') },
        { amount: 300, user: '5d8478b633741c1a882cc5b9', transactionDate: new Date('2019, 01') }
      ].forEach(async transaction => {
        this.log.info(`Creating transaction ...`, transaction);

        const transactionData = new this.TransactionModel(transaction);
        const newTransaction = await transactionData.save();
      });

      this.log.info('Fake Transaction data persisted');
      return await this.TransactionModel.find();
    } catch (ex) {
      this.log.error('error seeding transactions data', ex);
      throw boomify(ex);
    }
  }
}

export default options => new TransactionService(options)
