'use strict'

/**********************************************************************************
EXAMPLE for implementing http over tcp socket
**********************************************************************************/
const net=require('net');
const httpParser=(response)=>{
	const lines=response.split('\r\n');
	const words=lines[0].split(' ');
	const method=words[0];
	const url=words[1]
	const version=words[2];
	const header={};
	let reqBody='';
	for(let i=1;i<lines.length;i++){
		if(lines[i]==="") {reqBody=lines[i+1];
		break;}
		const trimmed=lines[i].trim();
		const headers=trimmed.split(':');
		header[headers[0].toLowerCase()]=headers[1].toLowerCase();
	}
	return {method,url,version,header,reqBody}
	}
	const server=net.createServer();
	server.on('connection',(socket)=>{
		socket.on('data',(data)=>{
			const statusCode=200
			console.log(data)
			const helper=httpParser(data.toString());
			const metaData=`${helper.version} ${statusCode}`
			const headers=['connection:keep-alive','transfer-encoding:chunked','date:'+Date.now()]
			const body=JSON.stringify({'error':'something went worng'});
			const length=Buffer.byteLength(body);
			const headersString=headers.join('\r\n');
			socket.write(metaData);
			// socket.write('\r\n');
			socket.write(headersString);
			socket.write('\r\n\r\n');
			socket.write(length.toString());
			socket.write('\r\n');
			socket.write(body);
			socket.write('\r\n');
			socket.write('0')

		})
	})

	server.listen(3001)
/****************************************************************************************
EXAMPLE for a terminal based chat app
*****************************************************************************************/
const GUID='258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

let listeners={};


server.on('connection',(socket)=>{
    const id=crypto.randomBytes(4).toString('hex');
    socket.id=id;
    listeners[id]=socket;
    const key = crypto.createHash('sha1')
    .update(req.headers['sec-websocket-key'] +GUID, 'binary')
    .digest('base64');

  const headers = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${key}`
  ];
  socket.write(headers.concat('\r\n').join('\r\n'));
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




//let response=`POST /tokens HTTP/1.1\r\nHost: localhost:4443\r\nContent-Type: application/json\r\nContent-Length: ${length}\r\ntoken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InBob25lIjoiOTkxMDMyNjY0MiJ9LCJ0aW1lIjoxNTM1MTE5NzM1ODY1fQ==.Bol4EyrvUQPK3/ecQ1/Dt6wytX7xXco4VCZz4zscKXQ=\r\n\r\n${stringBody}\r\n`
