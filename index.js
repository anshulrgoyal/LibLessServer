const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;




const server = http.createServer((req, res) => {
    const parserdUrl = url.parse(req.url, true);
    const trimedUrl = parserdUrl.pathname.replace(/^\/|\/$/g, "");
    const {headers,method} = req;
    let buffer = "";
    let querParameter=parserdUrl.query;
    const decoder = new StringDecoder('utf-8');
    req.on('data', function (data) {
        buffer += decoder.write(data);
    })
    req.on('end', function () {
        buffer += decoder.end();
        chooseHandler=trimedUrl in handler ? handler[trimedUrl] : handleNotFound;
        data={payload:buffer,querParameter,method,headers,parserdUrl,trimedUrl}
        chooseHandler(data,(statusCode,json)=>{
             res.setHeader('Content-Type','application/json');
             res.writeHead(statusCode)
             res.end(JSON.stringify(json));
        })
    })
})









server.listen(3000, () => {
    console.log('server started at port 3000');
})

handleNotFound=(data,cb)=>{
    cb(404,{});
}
handler={};

handler['sample']=function(data={},cb=()=>{}){
    cb(200,{'name':'anshul'});
}