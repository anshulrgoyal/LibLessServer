'use strict'
const crypto = require('crypto');
const db = require('./db');

let handler = {};
handler._user = {};
handler._user.post = (data, cb) => {
    const { payload: { firstName, lastName, password, phone } } = data;
    if (!!firstName && !!lastName && !!lastName && !!password && !!phone) {
        db.read('users', phone, (err, data) => {
            if (err) {
                const salt = crypto.randomBytes(16).toString('hex');
                const hashedPassword = crypto.createHmac('sha256', salt).update(password).digest('hex');
                const user = { salt, hashedPassword, firstName, lastName, phone };

                db.create('users', phone, user, (err) => {
                    if (err) {
                        cb(404, { err: 'no record for the given phone number found' });
                    }
                    else {
                        delete user.hashedPassword;
                        delete user.salt;
                        cb(200, { user });
                    }
                })
            }
            else {
                cb(503, { err: 'user with phone number already exists' });
            }
        })
    }
    else {
        cb(400, { err: "all fields are required" });
    }
}

// @TODO add authenticate middleware
handler._user.get = (data, cb = () => { }) => {
    const { queryParameter: { phone } } = data;
    if (phone.length >= 10) {
        db.read('users', phone, (err, user) => {
            if (err) cb(404, { err: 'no record for the given phone number found' });
            else {
                delete user.hashedPassword;
                delete user.salt;
                cb(200, { user })
            };
        })
    }
    else {
        cb(400, { err: "please provide a valid phone number" })
    }
}
handler._user.put = (data, cb = () => { }) => {
    const { payload: { firstName, lastName, password, phone } } = data;
    db.read('users', phone, (err, user) => {
        if (err) cb(404, { err: 'no user found' })
        else {
            if (!!firstName) user.firstName = firstName;
            if (!!lastName) user.lastName = lastName;
            db.create('user', phone, user, (err, data) => {
                if (err) cb(503, { err: 'err while writing the changes' });
                else {
                    delete user.hashedPassword;
                    delete user.salt;
                    cb(200, { user });
                }
            })
        }
    })
}
handler.user = (data, cb = () => { }) => {
    const { method } = data;
    const allowedMethods = ['post', 'get', 'put', 'delete'];

    if (allowedMethods.indexOf(method) !== -1) {
        handler._user[method](data, cb);
    }
    else {
        cb(405, { err: "unknown method" });
    }
}
module.exports = handler;
