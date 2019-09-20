import mongoose from 'mongoose'
import bluebird from 'bluebird'
import crypto from 'crypto'

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'transaction amount is required'],
    minlength: [5, 'full name cannot be less than 3 letters']
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },

  provider: String,
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
    var currentDate = new Date()
    this.updatedAt = currentDate
  })

TransactionSchema.index({ user: 1 }, { background: true })
TransactionSchema.index({ createdAt: 1 }, { background: true })

export default mongoose.model('Transaction', TransactionSchema)
