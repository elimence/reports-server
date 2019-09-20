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

  async getSummary (transactions) {
    this.log.info('Generating summary');

    try {
      const summary = {
        total: 0,
        maxPayment: transactions[0].amount,
        minPayment: transactions[0].amount
      };

      transactions.forEach(transaction => {
        summary.total += transaction.amount;

        if (transaction.amount > summary.maxPayment) summary.maxPayment = transaction.amount;
        if (transaction.amount < summary.minPayment) summary.minPayment = transaction.amount;
      });


      this.log.info('Summary complete !');
      return { summary, transactions };
    } catch (ex) {
      this.log.error('error generating summary', ex);
      throw boomify(ex);
    }
  }

  async getReport ({ start, end, type }) {
    try {
      const transactions = await this.transactionService.getForRange({ start, end });
      return transactions;
    } catch (ex) {
      this.log.error('error fetching reports', ex);
      throw boomify(ex);
    }
  }

  async getMonthlyReport ({ type = 'json' }) {
    this.log.info(`Preparing ${type} report ...`);

    try {
      const transactions = await this.transactionService.getForCurrentMonth();
      const summary = await this.getSummary(transactions);
      const processedData = this.prepareData(summary);

      this.log.info('Report ready !');
      return processedData;
      ;
    } catch (ex) {
      this.log.error('error creating report csv', ex);
      throw boomify(ex);
    }
  }

  async prepareData ({ summary, transactions }) {
    let reportData = [];
    const columns = {
      id: 'Customer Id',
      amount: 'Amount',
      date: 'Date'
    };

    for (let i = 0; i < 10; i++) {
      reportData.push([
        transactions[i]._id.toString(),
        transactions[i].amount,
        transactions[i].transactionDate
      ]);
    }

    reportData.push(['', '', '']);
    reportData.push(['Minimum Payment', 'Maximum Payment', 'Total']);

    reportData.push([
      summary.minPayment,
      summary.maxPayment,
      summary.total
    ]);

    return { columns, reportData};
  }
}

export default options => new ReportService(options)
