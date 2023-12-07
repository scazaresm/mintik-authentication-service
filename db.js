const mongoose = require('mongoose');

const dbHost = process.env.MONGODB_HOST;
const dbPort = process.env.MONGODB_PORT;
const dbUser = process.env.MONGODB_ROOT_USERNAME;
const dbPassword = process.env.MONGODB_ROOT_PASSWORD;
const dbName = process.env.DB_NAME;

const connectionString = `mongodb://${dbHost}:${dbPort}/${dbName}`;

console.log(`Service is connecting to MongoDB...`);
mongoose.connect(connectionString, {
  connectTimeoutMS: 5000,
  authSource: 'admin',
  auth: {
    username: dbUser,
    password: dbPassword,
  },
});

const db = mongoose.connection;

module.exports = db;
