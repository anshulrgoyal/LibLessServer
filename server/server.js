'use strict'

const http = require('http');
const https = require('https');
const url = require('url');
const queryString = require('querystring')
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const cluster = require('cluster')

// extra code for help
const handler = require('./lib/handler');
const helper = require('./lib/helper');

// ports for the process 
const httpPort = 4443;
const httpsPort = 3000;

// http server
const serverHttp = http.createServer((req, res) => {
    serverLogic(req, res);
})

const options = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem'),
};
const serverHttps = https.createServer(options, (req, res) => {
    serverLogic(req, res);
})

serverHttp.listen(httpPort, () => {
    console.log('http server started in at port ' + httpPort);
})

serverHttps.listen(httpsPort, () => {
    console.log('https server started at port ' + httpsPort);
})
const handleNotFound = (data, cb) => {
    cb(404, {});
}

const serverLogic = (req, res) => {
    const parserdUrl = url.parse(req.url, true);
    const trimedUrl = parserdUrl.pathname.replace(/^\/|\/$/g, "");
    let { headers, method } = req;
    method = method.toLowerCase();

    let buffer = "";
    let queryParameter = parserdUrl.query;
    const decoder = new StringDecoder('utf-8');
    let user = null;
    if ('token' in headers) {
        helper.verify(headers.token, (err, tokenUser) => {
            if (err);
            else {
                user = tokenUser;
            }
        })
    }
    req.on('data', function (data) {
        buffer += decoder.write(data);
    })
    req.on('end', function () {
        buffer += decoder.end()
        if(buffer){
            if (headers['content-type'] === 'application/x-www-form-urlencoded') buffer = queryString.parse(buffer);
        if (headers['content-type'] === 'application/json') buffer = JSON.parse(buffer)
        }
        const chooseHandler = trimedUrl in handler ? handler[trimedUrl] : handleNotFound;
        const data = { payload: buffer, queryParameter, method, headers, parserdUrl, trimedUrl, user };
       try{
        chooseHandler(data, (statusCode, payload, contentType) => {
            processHandler(res, statusCode, payload, contentType)
        })
       }
       catch(e){
          whenError(res);
       }
    })
}
const whenError=(res)=>{
res.writeHead(500)
res.end('error')
}
const processHandler = (res, statusCode, payload, contentType) => {
    if (contentType = 'json') { payload = JSON.stringify(payload); res.setHeader('Content-Type', 'application/json'); }
    else if (contentType = 'html') res.setHeader('Content-Type', 'application/xml+html');
    else if (contentType = 'js') res.setHeader('Content-Type', 'application/javascript');
    else if (contentType = 'jpeg') res.setHeader('Content-Type', 'image/jpeg');
    else if (contentType = 'css') res.setHeader('Content-Type', 'text/css');
    res.writeHead(statusCode);
    res.end(payload)
}
console.log(process.pid);
setTimeout(() => {
    process.exit(1)

}, Math.random() * 100000)