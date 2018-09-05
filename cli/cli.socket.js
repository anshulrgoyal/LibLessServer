const net =require('net');
const dns=require('dns');
const URL=require('url');
const socket=net.Socket();
 
let error=0;
let sucess=0;
// dns.lookup()
for(var i=0;i<2;i++){
    const listener=socket.connect({port:4443,hostname:'localhost'})
    listener.on('error',(err)=>{
        error++
        console.log(err)
    })
    listener.on('data',(data)=>{
        sucess++;
        listener.destroy(0);
    })
    
    listener.write(`GET /tokens HTTP/1.1\r\nHost: localhost:3001\r\nContent-Type: application/json\r\n\r\n`)
}