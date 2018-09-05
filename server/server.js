'use strict'

const http = require('http');
const https = require('https');
const url = require('url');
const queryString = require('querystring')
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');

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

// all the logic for running and extracting data from the request
const serverLogic = (req, res) => {
  //getting the url from the request and parseing it with url.parser and querystring
    const parserdUrl = url.parse(req.url, true);

// removing front and end slash from the url
    const trimedUrl = parserdUrl.pathname.replace(/^\/|\/$/g, "");

    //getting headers and method from req
    let { headers, method } = req;

    // turning the method to lowercase
    method = method.toLowerCase();

    // getting query
    let queryParameter = parserdUrl.query;

    // setting the user
    let user = null;
    if ('token' in headers) {
        helper.verify(headers.token, (err, tokenUser) => {
           if (err);
              else {
                  user = tokenUser;
              }
          })
        }
    // getting the data from the req
    let buffer = "";
    // decoding the buffer to string
    const decoder = new StringDecoder('utf-8');
    req.on('data', function (data) {
        buffer += decoder.write(data);
    })
    req.on('end', function () {
        buffer += decoder.end()
        if(buffer){
            if (headers['content-type'] === 'application/x-www-form-urlencoded') buffer = queryString.parse(buffer)
        if (headers['content-type'] === 'application/json') buffer = JSON.parse(buffer)
        }
        const chooseHandler = trimedUrl in handler ? handler[trimedUrl] : handleNotFound;
        const data = { payload: buffer, queryParameter, method, headers, parserdUrl, trimedUrl, user };
       try{
         // selecting a handler
        chooseHandler(data, (statusCode, payload, contentType) => {
            processHandler(res, statusCode, payload, contentType)
        })
       }
       catch(e){
          whenError(res);
       }
    })
}
// error handling
const whenError=(res)=>{
res.writeHead(500)
res.end('error')
}


const processHandler = (res, statusCode, payload, contentType) => {
  // setting up content type header for response
    if (contentType = 'json') { payload = JSON.stringify(payload); res.setHeader('Content-Type', 'application/json'); }
    else if (contentType = 'html') res.setHeader('Content-Type', 'application/xml+html');
    else if (contentType = 'js') res.setHeader('Content-Type', 'application/javascript');
    else if (contentType = 'jpeg') res.setHeader('Content-Type', 'image/jpeg');
    else if (contentType = 'css') res.setHeader('Content-Type', 'text/css');
    // status code
    res.writeHead(statusCode);
    res.end(payload)
}
