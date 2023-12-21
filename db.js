// Commons Clause License
//
// The Software is provided to you by the Licensor under the License, as
// defined below, subject to the following condition.
//
// Without limiting other conditions in the License, the grant of rights
// under the License will not include, and the License does not grant to you,
// the right to sell, leverage, or otherwise commercialize the Software.
//
// For purposes of the foregoing, "sell" means practicing any or all of the
// rights granted to you under the License to provide to third parties,
// for a fee or other consideration (including without limitation fees
// for hosting or consulting/ support services related to the Software),
// a product or service whose value derives, entirely or substantially,
// from the functionality of the Software.
//
// Any license notice or attribution required by the License must also
// include this Commons Clause License Condition notice.
//
// Software: mintik-authentication-service
// License: MIT License
// Licensor: Sergio Cazares
// Commons Clause License URL: https://github.com/scazaresm/mintik-authentication-service/blob/main/LICENSE

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
