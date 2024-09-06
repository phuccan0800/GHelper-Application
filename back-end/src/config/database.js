const mongoose = require('mongoose')

//myslq2 connect
// const connection = mysql.createPool({
//     host: process.env.HOST_DATABASE,
//     user: process.env.USER_DATABASE,
//     password: process.env.PASSWORD_DATABASE,
//     database: process.env.DATABASE,
//     connectionLimit: 50,
//     queueLimit: 1000
// })

//mongoosedb connect 
const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_DATABASE);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Connection error', error);
    process.exit(1);
  }
}

module.exports = connection;