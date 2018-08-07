'use strict'
const crypto = require('crypto');
const db = require('./db');
const helper = require('./helper')

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


handler._user.get = (data, cb = () => { }) => {
    const { queryParameter: { phone } } = data;
    if (!!data.user && phone === data.user.phone) {
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
    else {
        cb(400, { err: 'Not Allowed' })
    }
}
handler._user.put = (data, cb = () => { }) => {
    const { payload: { firstName, lastName, password, phone } } = data;
    if (!!data.user && phone === data.user.phone) {
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
    else {
        cb(400, { err: 'Not Allowed' })
    }
}
handler._user.delete = (data, cb = () => { }) => {
    const { queryParameter: { phone } } = data;
    if (!!data.user && phone === data.user.phone) {
        if (phone.length >= 10) {
            db.delete('users', phone, (err) => {
                if (err) cb(404, { err: 'no record for the given phone number found' });
                else {
                    cb(200, { Success: "Delete sucessfull" })
                };
            })
        }
        else {
            cb(400, { err: "please provide a valid phone number" })
        }
    }
    else {
        cb(400, { err: 'Not Allowed' })
    }
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
handler._tokens = {};
handler._tokens.post = (data, cb) => {
    const { payload: { password, phone } } = data;
    if (!!password && !!phone) {
        db.read('users', phone, (err, user) => {
            if (err) cb(404, { err: "User not found" })
            else {
                const hashedPassword = crypto.createHmac('sha256', user.salt).update(password).digest('hex');
                if (hashedPassword === user.hashedPassword) {
                    const token = helper.createToken({ phone }, 6);
                    cb(200, { token });
                }
                else {
                    cb(405, { "err": "worng user name or password" })
                }
            }
        })
    }
    else {
        cb(400, { err: "Please provide password and phone number" })
    }
}
handler._tokens.get = (data, cb) => {
    const { queryParameter: { token } } = data;
    if (!!token) {
        helper.refresh(token, (err, newToken) => {
            if (err) {
                cb(400, { err });
            }
            else {
                cb(200, { token: newToken })
            }
        })

    }
    else {
        cb(400, { err: "please provide a valid token" })
    }
}
handler.tokens = (data, cb = () => { }) => {
    const { method } = data;
    const allowedMethods = ['post', 'get'];

    if (allowedMethods.indexOf(method) !== -1) {
        handler._tokens[method](data, cb);
    }
    else {
        cb(405, { err: "unknown method" });
    }
}


module.exports = handler;
