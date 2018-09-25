'use strict'
const crypto = require('crypto');

let lib = {};

/**
 * the method for creating tokens
 * @param  {Object} payload the data to be encoded in the token
 * @param  {Number} time    the the time after which token expires
 * @return {[type]}         [description]
 */
lib.createToken = (payload, time) => {
  const head = Buffer.from(JSON.stringify({
    "alg": "HS256",
    "typ": "JWT"
  })).toString('base64').replace(/\-/g, "+").replace(/_/g, "/");
  const pay = Buffer.from(JSON.stringify({
    payload,
    time: time * 1000 * 60 * 60 + Date.now()
  })).toString('base64').replace(/\-/g, "+").replace(/_/g, "/");

  const sign = crypto.createHmac('SHA256', 'some').update(head + '.' + pay).digest('base64').replace(/\-/g, "+").replace(/_/g, "/");
  return head + '.' + pay + '.' + sign;
}

/**
 * the method to verify the token
 * @param  {String}   token the token to be verified
 * @param  {Function} cb    the function envoked on completetion
 * @return {[Null]}         
 */
lib.verify = (token, cb) => {
  const [head, pay, sign] = token.split('.');
  const verifySign = crypto.createHmac('SHA256', 'some').update(head + '.' + pay).digest('base64').replace(/\-/g, "+").replace(/_/g, "/");
  if (sign == verifySign) {
    let payload = pay.replace(/\+/g, "-").replace(/\//g, "_");
    payload = Buffer.from(payload, 'base64').toString('utf-8');
    payload = JSON.parse(payload);
    if (payload.time > Date.now()) {
      cb(null, payload.payload);
    } else {
      cb('token expired', null);
    }
  } else {
    cb('token invalid', null);
  }
}

/**
 * the method to refresh the token
 * @param  {String}   token the token to be refreshed
 * @param  {Function} cb    the function envoked on completetion
 * @return {[Null]}         
 */
lib.refresh = (token, cb) => {
  const [head, pay, sign] = token.split('.');
  const verifySign = crypto.createHmac('SHA256', 'some').update(head + '.' + pay).digest('base64').replace(/\-/g, "+").replace(/_/g, "/");
  if (sign == verifySign) {
    let payload = pay.replace(/\+/g, "-").replace(/\//g, "_");
    payload = Buffer.from(payload, 'base64').toString('utf-8');
    payload = JSON.parse(payload);
    if (payload.time < Date.now()) {
      cb(null, lib.createToken(payload.payload, 6));
    } else {
      cb('token not expired', null);
    }
  } else {
    cb('token invalid', null);
  }
}

module.exports = lib;
