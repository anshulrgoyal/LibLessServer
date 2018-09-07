const net = require('net');
const dns = require('dns');
const URL = require('url');

/*******************************************************************************
Trying to use socket in place of request in place of http
*******************************************************************************/


const ajax = (url = 'localhost:3000', options = {},
  cb = () => {}
) => {
  const time = Date.now();
  options = {
    method: 'GET',
    body: '',
    headers: {
      'content-type': 'application/json'
    },
    ...options
  }
  const {
    hostname,
    port,
    pathname
  } = URL.parse(url);
  const {
    method,
    body,
    headers
  } = options;
  const headersToSent = Object.keys(headers).map(key => `${key}:${headers[key]}`).join('\r\n')
  const socket = net.Socket();
  const listener = socket.connect({
    port: 4443,
    hostname: 'localhost'
  })
  listener.on('error', (err) => {
    cb(err, null, Date.now() - time, 500);
    listener.destroy();
  })
  listener.on('data', (data) => {
    cb(null, data, Date.now() - time, 200)
    listener.destroy(0);
  })

  listener.write(`${method} ${pathname} HTTP/1.1\r\nHost: ${hostname}:${port}\r\n${headersToSent}\r\n\r\n`)
}
module.exports = {
  ajax
};
