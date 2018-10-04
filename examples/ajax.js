const https = require('https');
const URL = require('url');
const queryString = require('querystring')




// cb must be function
// this is the example for supporting both promise and callback
/**
 *@required @param  {String} url Must be string for making a request
 *@required @param {Object} headers optional headers
 *@required @param {Function} cb Function which is invoked when response is there
 *@return {Promise<Object>}
 */


ajax = (url, options = {}, cb) => {
  options = {
    method: 'get',
    body: null,
    ...options
  }
  const {
    method,
    body,
    headers
  } = options;
  let bodyTobeSent = ""
  let contentType = 'application/json'

  if (body && 'json' in body) {
    bodyTobeSent = JSON.parse(body.json);
    contentType = 'application/json'
  }
  if (body && 'formdata' in body) {
    bodyTobeSent = queryString.stringify(body.formdata);
    contentType = 'application/x-www-form-urlencoded'
  }

  let responseData = "";
  return new Promise((resolve, reject) => {
    const parsedUrl = URL.parse(url, true);
    const options = {
        ...parsedUrl,
        method,
      headers: { ...headers,
        'user-agent': 'liblessserver',
        'content-type': contentType,
        'content-length': Buffer.byteLength(bodyTobeSent)
      },

    }
    const req = https.request(options, (res) => {
      res.on('data', (data) => {
        responseData = responseData + data;
      })
      res.on('end', (data) => {
        if (cb && typeof(cb) === 'function') {
          cb(null, responseData)
        } else {
          resolve(responseData);
        }
      })
    });
    if(body&&('formdata' in body||'json' in body)){
        req.write(bodyTobeSent);
    }
    req.on('error', (err) => {
      if (cb && typeof(cb) === 'function') {
        cb(err, null);
      } else {
        reject(err);
      }
    })
    req.end()

  });
}

/*******************************************************************************
                                    EXAMPLE USES CASE
******************************************************************************/
if (module == require.main) {
  ajax('https://api.github.com/users', {
    method: 'GET',
    }, (er, data) => {
    console.log(er, data);
  })
}
