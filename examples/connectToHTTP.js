const net = require('net')

const socket = net.Socket();

const listener = socket.connect({
  port: 4443,
  host: 'localhost'
});

listener.on('connection', (data) => {
  console.log(data)
})
listener.on('data', (data) => {
  console.log(data.toString())
})
const body = {
  "firstName": "Anshul",
  "lastName": "Goel",
  "phone": "**********",
  "password": "**********",
  "statusCode": [200, 404, 502],
  "timeOut": "5",
  "url": "zalonin.com",
  "protocol": "https",
  "method": "get"
}
const stringBody = JSON.stringify(body);
const length = Buffer.byteLength(stringBody)
listener.write(`POST /tokens HTTP/1.1\r\nHost: localhost:3001\r\nContent-Type: application/json\r\nContent-Length: ${length}\r\ntoken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InBob25lIjoiOTkxMDMyNjY0MiJ9LCJ0aW1lIjoxNTM1MTE5NzM1ODY1fQ==.Bol4EyrvUQPK3/ecQ1/Dt6wytX7xXco4VCZz4zscKXQ=\r\n\r\n${stringBody}\r\n`)
