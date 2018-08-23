'use strict'


const net=require('net');
const crypto=require('crypto');

const server=net.createServer();
//const GUID='258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

let listeners={};


server.on('connection',(socket)=>{
    const id=crypto.randomBytes(4).toString('hex');
    socket.id=id;
    listeners[id]=socket;
    // const key = crypto.createHash('sha1')
    // .update(req.headers['sec-websocket-key'] +GUID, 'binary')
    // .digest('base64');

//   const headers = [
//     'HTTP/1.1 101 Switching Protocols',
//     'Upgrade: websocket',
//     'Connection: Upgrade',
//     `Sec-WebSocket-Accept: ${key}`
//   ];
//   socket.write(headers.concat('\r\n').join('\r\n'));
    socket.write('Welcome to Chat Room\n');
    socket.write('Your id is :')
    socket.write(socket.id)
    socket.write('\n');
    socket.on('data',(data)=>{
        console.log(data.toString())
    Object.values(listeners).forEach(element => {
        console.log(element.id)
        if(element.id==socket.id) return;
        element.write(socket.id)
        element.write(':')
        element.write(data.toString())
        element.write('\n');
    });

    })
})

server.listen(3000,()=>{
    console.log('server is listening on port : 3000');
})