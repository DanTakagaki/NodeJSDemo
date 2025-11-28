// If we install mongoose this all is taken care of by  it in app.js

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// let _db;

// const mongoConnect = (callback) => {
//     MongoClient.connect(process.env.MONGODB_URI)
//         .then(client => {
//             console.log('Connected to MongoDB');
//             _db = client.db();
//             callback();
//         })
//         .catch(err => {
//             console.log('Failed to connect to MongoDB', err);
//             throw err;
//         });
// };

// const getDb = () => {
//     if (_db) {
//         return _db;
//     }
//     throw 'No database found!';
// };

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;