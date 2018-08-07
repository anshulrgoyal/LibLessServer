const crypto = require('crypto');

lib = {};
// time in hours,payload is an object
lib.createToken = (payload, time) => {
    const head=Buffer.from(JSON.stringify({
        "alg": "HS256",
        "typ": "JWT"
    })).toString('base64').replace(/\-/g, "+").replace(/_/g, "/");
const pay=Buffer.from(JSON.stringify({payload,time:time*1000*60*60+Date.now()})).toString('base64').replace(/\-/g, "+").replace(/_/g, "/");

const sign=crypto.createHmac('SHA256','some').update(head+'.'+pay).digest('base64').replace(/\-/g, "+").replace(/_/g, "/");
return head+'.'+pay+'.'+sign
}
lib.verify=(token,cb)=>{
    const [head,pay,sign]=token.split('.');
    const verifySign=crypto.createHmac('SHA256','some').update(head+'.'+pay).digest('base64').replace(/\-/g, "+").replace(/_/g, "/");
    if(sign==verifySign){
      let payload=pay.replace(/\+/g, "-").replace(/\//g, "_");
      payload=Buffer.from(payload,'base64').toString('utf-8');
      payload=JSON.parse(payload);
      if(payload.time>Date.now()){
        cb(null,payload.payload);
      }
      else{
          cb('token expired',null);
      }
    }
    else{
   cb('token invalid',null);
    }
}

module.exports=lib;
