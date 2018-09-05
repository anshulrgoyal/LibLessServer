const https = require('https');
const URL = require('url');
const queryString=require('querystring')




// cb must be function
// this is the example for supporting both promise and callback
/**
* @param url Must be string for making a request
* @param method by default it is get method can be any http verb
* @param body the body for the request
* @param headers optional headers
* @param cb Function which is invoked when response is there
*/


ajax = (url, method, body=null, headers = {"Content-Type":"application/json"},cb) => {
    let responseData="";
    return new Promise((resolve, reject) => {
        const parsedUrl = URL.parse(url, true);
        const options = {...parsedUrl,
            method,
            headers:{...headers,'user-agent':'liblessserver'},

        }
        const req = https.request(options,(res)=>{
            res.on('data',(data)=>{
                responseData=responseData+data;
            })
            res.on('end',(data)=>{
              if(cb&&typeof(cb)==='function'){
                cb(null,responseData)
              }
              else{
                resolve(responseData);
              }
            })
        });
        if (typeof (body) == 'object') {
            req.write(JSON.stringify(body));
        }
        req.on('error', (err) => {
            if(cb&&typeof(cb)==='function'){
              cb(err, null);
            }
            else{
              reject(err);
            }
        })

    });
}

/*******************************************************************************
                                    EXAMPLE USES
******************************************************************************/

/**
* const body={name: "paul rudd",
* movies: ["I Love You Man", "Role Models"]}
* post request with json
* ajax('https://api.github.com/users','POST',body,{'Content-Length':Buffer.byteLength(JSON.stringify(body))}).then((data)=>{
*     console.log(data)
* }).catch((err)=>{
*     console.log(err);
* })
*/



/**
*get request
*ajax('https://api.github.com/users','GET').then((data)=>{
*    console.log(data);
*}).catch((err)=>{
*    console.log(err)
*})
*
* formdata req
*ajax('https://api.github.com/users','POST',queryString.stringify(body),{'Content-type':'multipart/form-data'}).then((data)=>{
*    console.log(data);
*}).catch((err)=>{
*    console.log(err)
*})
*
*/
