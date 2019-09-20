import mongoose from 'mongoose'
import bluebird from 'bluebird'
import crypto from 'crypto'

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'transaction amount is required']
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  transactionDate: {
    type: Date,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },

  salt: {
    type: String,
    select: false
  }
})

/**
 * Methods
 */
TransactionSchema.methods = {}



TransactionSchema
  .pre('save', function (next) {
    this.updatedAt = new Date();
    next();
  });

TransactionSchema.index({ user: 1 }, { background: true });
TransactionSchema.index({ createdAt: 1 }, { background: true });

export default mongoose.model('Transaction', TransactionSchema)
