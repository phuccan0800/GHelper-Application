const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    transactionDate: { type: Date, default: Date.now },
    type: { type: String, enum: ['Credit', 'Debit'], required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
