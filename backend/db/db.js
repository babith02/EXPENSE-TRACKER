const mongoose = require('mongoose');
const { param } = require('../routes/transactions');

const db = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect("mongodb://127.0.0.1:27017/expense")
        console.log('Db Connected')
    } catch (error) {
        console.log('DB Connection Error');
    }
}

module.exports = {db}