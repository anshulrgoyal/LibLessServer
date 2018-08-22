const https = require('https');
const URL = require('url');
const queryString=require('querystring')




// cb must be function
ajax = (url, method, body=null, headers = {"Content-Type":"application/json"},cb = () => { }) => {
    let responseData="";
    return new Promise((resolve, reject) => {
        const parsedUrl = URL.parse(url, true);
        const options = {
            hostname: parsedUrl.hostname,
            protocol: parsedUrl.protocol,
            path:parsedUrl.pathname,
            method,
            headers:{...headers,'user-agent':'liblessserver'},

        }
        const req = https.request(options,(res)=>{
            res.on('data',(data)=>{
                responseData=responseData+data;
            })
            res.on('end',(data)=>{
                cb(null,responseData)
                console.log(responseData)
                resolve(responseData);
            })
        });
        if (typeof (body) == 'object') {
            req.write(JSON.stringify(body));
        }
        req.on('error', (err) => {
            cb(err, null);
            reject(err);
        })
        
    });
}

const body={name: "paul rudd",
movies: ["I Love You Man", "Role Models"]}
// post request with json
// ajax('https://api.github.com/users','POSt',body,{'Content-Length':Buffer.byteLength(JSON.stringify(body))}).then((data)=>{
//     console.log(data)
// }).catch((err)=>{
//     console.log(err);
// })



//get request
ajax('https://api.github.com/users','GET').then((data)=>{
    console.log(data);
}).catch((err)=>{
    console.log(err)
})

// formdata req
ajax('https://api.github.com/users','POST',queryString.stringify(body),{'Content-type':'multipart/form-data'}).then((data)=>{
    console.log(data);
}).catch((err)=>{
    console.log(err)
})
