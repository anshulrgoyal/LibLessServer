/**
 * the file contains all the function required to interact to db
 */


'use strict'


const net = require('net');

let lib = {};

/**
 * the function to create a entry to the db   
 * @param  {string}   dir    the collection to which the document to be added
 * @param  {String}   record the document ot which the document is to be added
 * @param  {Object}   data   the data to be added to document
 * @param  {Function} cb     the function which is envoked on compeletion
 * @return {NULL}          
 */
lib.create = (dir, record, data, cb = () => {}) => {
  let response = '';
  const socket = net.connect({
    host: 'localhost',
    port: 4442
  })
  socket.on('data', (data) => {
    response += data.toString();
  })
  socket.on('end', () => {
    const [type, data] = response.split('\r\n');
    if (type === 'error') cb(data, null);
    else {
      cb(null, JSON.parse(data))
    }
    socket.destroy();
  })
  socket.on('error', (err) => {
    cb(err, null)
    socket.destroy()
  })
  const string = `create\r\n${dir}\r\n${record}\r\n${JSON.stringify(data)}`
  socket.write(Buffer.from(string));
}

/**
 * the function to delete a entry to the db   
 * @param  {string}   dir    the collection to which the document to be deleted
 * @param  {String}   record the document ot which the document is to be deleted
 * @param  {Function} cb     the function which is envoked on compeletion
 * @return {NULL}          
 */
lib.delete = (dir, record, cb) => {
  let response = '';
  const socket = net.connect({
    host: 'localhost',
    port: 4442
  })
  socket.on('data', (data) => {
    response += data.toString();
  })
  socket.on('end', () => {
    const [type, data] = response.split('\r\n');
    if (data) {
      try {
        JSON.parse(data)
      } catch {
        data
      }
    }
    if (type === 'error') cb(data, null);
    else {
      cb(null, JSON.parse(data))
    }
    socket.destroy();
  })
  socket.on('error', (err) => {
    cb(err, null)
    socket.destroy()
  })
  const string = `delete\r\n${dir}\r\n${record}`
  socket.write(Buffer.from(string));
}

/**
 * the function to read a entry to the db   
 * @param  {string}   dir    the collection to which the document to be read
 * @param  {String}   record the document ot which the document is to be read
 * @param  {Function} cb     the function which is envoked on compeletion
 * @return {NULL}          
 */
lib.read = (dir, record, cb) => {
  let response = '';
  const socket = net.connect({
    host: 'localhost',
    port: 4442
  })
  socket.on('data', (data) => {
    response += data.toString();
  })
  socket.on('end', () => {
    const [type, data] = response.split('\r\n');
    if (data) {
      try {
        JSON.parse(data)
      } catch(e) {
        data
      }
    }
    if (type === 'error') cb(data, null);
    else {
      cb(null, JSON.parse(data))
    }
    socket.destroy();
  })
  socket.on('error', (err) => {
    cb(err, null)
    socket.destroy()
  })
  const string = `read\r\n${dir}\r\n${record}`
  socket.write(Buffer.from(string));
}

/**
 * the function to update a entry to the db   
 * @param  {string}   dir    the collection to which the document to be updated
 * @param  {String}   record the document ot which the document is to be updated
 * @param  {Object}   data   the data to be added to document
 * @param  {Function} cb     the function which is envoked on compeletion
 * @return {NULL}          
 */
lib.update = (dir, record, data, cb) => {
  let response = '';
  const socket = net.connect({
    host: 'localhost',
    port: 4442
  })
  socket.on('data', (data) => {
    response += data.toString();
  })
  socket.on('end', () => {
    const [type, data] = response.split('\r\n');
    if (data) {
      try {
        JSON.parse(data)
      } catch {
        data
      }
    }
    if (type === 'error') cb(data, null);
    else {
      cb(null, JSON.parse(data))
    }
    socket.destroy();
  })
  socket.on('error', (err) => {
    cb(err, null)
    socket.destroy()
  })
  const string = `update\r\n${dir}\r\n${record}\r\n${JSON.stringify(data)}`
  socket.write(Buffer.from(string));
}


module.exports = lib;
