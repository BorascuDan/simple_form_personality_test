require('dotenv').config();

// Update this with your database configuration
module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: 'Z',  // Ensures all dates are treated as UTC
    decimalNumbers: true,
  },
  migrations: {
    directory: './migrations'
  }
};