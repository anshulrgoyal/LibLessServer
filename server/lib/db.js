const net = require('net');

let lib = {};
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
  const string = `read\r\n${dir}\r\n${record}`
  socket.write(Buffer.from(string));
}

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
