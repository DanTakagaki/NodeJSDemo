const getDb = require('../utils/database.js').getDb;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, id) {
        this.username = username;
        this.email = email;
        this._id = id ? new ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('users')
                .updateOne({ _id: this._id }, { $set: this });
        } else {
            dbOp = db.collection('users')
                .insertOne(this);
        }

        return dbOp
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users')
            .findOne({ _id: new ObjectId(id) })
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    };
}

module.exports = User;