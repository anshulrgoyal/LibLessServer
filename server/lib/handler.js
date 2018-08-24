'use strict'
const crypto = require('crypto');
const render=require('./template')
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
                const user = { salt, hashedPassword, firstName, lastName, phone, checks: 0, checkIds: [] };

                db.create('users', phone, user, (err) => {
                    if (err) {
                        cb(404, { err: 'no record for the given phone number found' },'json');
                    }
                    else {
                        delete user.hashedPassword;
                        delete user.salt;
                        cb(200, { user });
                    }
                })
            }
            else {
                cb(503, { err: 'user with phone number already exists' },'json');
            }
        })
    }
    else {
        cb(400, { err: "all fields are required" },'json');
    }
}


handler._user.get = (data, cb = () => { }) => {
    const { queryParameter: { phone } } = data;
    if (!!data.user && phone === data.user.phone) {
        if (phone.length >= 10) {
            db.read('users', phone, (err, user) => {
                if (err) cb(404, { err: 'no record for the given phone number found' },'json');
                else {
                    delete user.hashedPassword;
                    delete user.salt;
                    cb(200, { user })
                };
            })
        }
        else {
            cb(400, { err: "please provide a valid phone number" },'json')
        }
    }
    else {
        cb(400, { err: 'Not Allowed' },'json')
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
                    if (err) cb(503, { err: 'err while writing the changes' },'json');
                    else {
                        delete user.hashedPassword;
                        delete user.salt;
                        cb(200, { user },'json');
                    }
                })
            }
        })
    }
    else {
        cb(400, { err: 'Not Allowed' },'json')
    }
}
handler._user.delete = (data, cb = () => { }) => {
    const { queryParameter: { phone } } = data;
    if (!!data.user && phone === data.user.phone) {
        if (phone.length >= 10) {
            db.delete('users', phone, (err) => {
                if (err) cb(404, { err: 'no record for the given phone number found' },'json');
                else {
                    cb(200, { Success: "Delete sucessfull" },'json')
                };
            })
        }
        else {
            cb(400, { err: "please provide a valid phone number" },'json')
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
        cb(405, { err: "unknown method" },'json');
    }
}
handler._tokens = {};
handler._tokens.post = (data, cb) => {
    const { payload: { password, phone } } = data;
    if (!!password && !!phone) {
        db.read('users', phone, (err, user) => {
            if (err) cb(404, { err: "User not found" },'json')
            else {
                const hashedPassword = crypto.createHmac('sha256', user.salt).update(password).digest('hex');
                if (hashedPassword === user.hashedPassword) {
                    const token = helper.createToken({ phone }, 6);
                    cb(200, { token },'json');
                }
                else {
                    cb(405, { "err": "worng user name or password" },'json')
                }
            }
        })
    }
    else {
        cb(400, { err: "Please provide password and phone number" },'json')
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
        cb(400, { err: "please provide a valid token" },'json')
    }
}
handler.tokens = (data, cb = () => { }) => {
    const { method } = data;
    const allowedMethods = ['post', 'get'];

    if (allowedMethods.indexOf(method) !== -1) {
        handler._tokens[method](data, cb);
    }
    else {
        cb(405, { err: "unknown method" },'json');
    }
}
handler._checks = {};
handler._checks.post = (data, cb) => {
    if (data.user && data.user.phone) {
        const { payload: { protocol, url, statusCode, method, timeOut }, user: { phone } } = data;
        if (!!protocol && !!url && !!statusCode, !!method && timeOut) {
            db.read('users', phone, (err, user) => {
                if (err) cb(400, { err: 'Not Found' },'json')
                else {
                    if (user.checks < 5) {
                        let { checkIds } = user;
                        const checkId = crypto.randomBytes(4).toString('hex');
                        checkIds.push(checkId);
                        db.create('checks', checkId, { protocol, url, statusCode, method, timeOut, phone, checkId }, (err, data) => {
                            if (err) cb(400, { err: "error while creating check" },'json')
                            else {
                                db.update('users', phone, { checks: user.checks + 1, checkIds }, (err, updates) => {
                                    if (err) cb(400, { err: "error while saving" },'json')
                                    else {
                                        cb(200, { checks: data },'json')
                                    }
                                });
                            }
                        })
                    }
                    else {
                        cb(400, { err: "Checks exeeds the limits" },'json')
                    }
                }
            })
        }
        else {
            cb(400, { err: "Please provide all the info about check" },'json')
        }
    }
    else {
        cb(400, { err: 'please add token header' },'json')
    }
}
handler._checks.put = (data, cb = () => { }) => {
    const { queryParameter: { checkId } } = data;
    if (data.user && data.user.phone) {
        const { payload: { protocol, url, statusCode, method, timeOut }, user: { phone } } = data;
        db.read('checks', checkId, (err, check) => {
            if (checkId && check.phone === phone) {
                if (protocol || url || statusCode || method || timeOut) {
                    let updates = {}
                    if (protocol) {
                        updates.protocol = protocol;
                    }
                    if (url) {
                        updates.url = url;
                    }
                    if (statusCode) {
                        updates.statusCode = statusCode;
                    }
                    if (method) {
                        updates.method = method;
                    }
                    if (timeOut) {
                        updates.timeOut = timeOut;
                    }
                    db.update('checks', checkId, updates, (err, data) => {
                        if (err) cb(400, { err: 'while updating' },'json')
                        else {
                            cb(200, { upadted: data })
                        }
                    })
                }
                else {
                    cb(400, { err: "please provide any flieds to update" },'json')
                }
            }
            else {
                cb(400, { err: "not allowed" },'json')
            }
        })
    }
    else {
        cb(400, { err: 'not allowed' })
    }
}
handler._checks.get = (data, cb) => {
    if (data.user && data.user.phone) {
        const { queryParameter: { checkId }, user: { phone } } = data;
        db.read('checks', checkId, (err, check) => {
            if (check.phone === phone) {
                if (err) cb(400, { err: "error while reading" },'json')
                else cb(200, { check })
            }
            else {
                cb(400, { err: "not allowed" },'json')
            }
        })
    }
    else {
        cb(400, { err: "not allowed" },'json')
    }
}

handler._checks.delete = (data, cb) => {
    if (data.user && data.user.phone) {
        const { queryParameter: { checkId }, user: { phone } } = data;
        db.read('checks', checkId, (err, check) => {
            if (check&&check.phone === phone) {
                if (!err) {
                    db.delete('checks', checkId, (err, check) => {
                        if (err) cb(400, { err: "error while deleting" },'json')
                        else {
                            cb(200, { Deleting: "sucess" },'json')
                        }
                    })

                }
                else cb(400, { err: 'error while deleting' },'json')
            }
            else {
                cb(400, { err: "not allowed" },'json')
            }
        })
    }
    else {
        cb(400, { err: "not allowed" },'json')
    }
}

handler.checks = (data, cb = () => { }) => {
    const { method } = data;
    const allowedMethods = ['post', 'get', 'put', 'delete'];

    if (allowedMethods.indexOf(method) !== -1) {
        handler._checks[method](data, cb);
    }
    else {
        cb(405, { err: "unknown method" },'json');
    }
}
handler.index=(data,cb=()=>{})=>{


}
module.exports = handler;
