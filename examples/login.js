const crypto=require('crypto');
const dbServer=require('../server/lib/dbServer');
const db=require('../server/lib/db');
const {createSession,parseSession,updateSession,}=require('./sessions');

/***********************************************************************
EXAMPLE use db from serve any db can be used
***********************************************************************/
const login=(username,password,res,cb)=>{
  db.read('user',username,(err,foundUser)=>{
    if(err){
      cb('unable to read user from db',null);
    }
    else{
      const hash=crypto.createHmac('sha256', foundUser.salt).update(password).digest('hex');
      if(hash===foundUser.hash){
        updateSession(createSession(res),foundUser);
        cb(null,foundUser);
      }
      else{
        cb('invalid username or password',null);
      }
    }
  })
}
const signup=(username,password,res,cb)=>{
  db.read('user',username,(err,foundUser)=>{
    if(!err){
      cb('user already exists',null);
    }
    else{
      const salt=crypto.randomBytes(6).toString('hex');
      const hash=crypto.createHmac('sha256', salt).update(password).digest('hex');
      db.create('user',username,{hash,salt,username},(err,foundUser)=>{
        updateSession(createSession(res),foundUser);
        cb(null,foundUser);
      })
    }
  })
}

const authenticate=(req,res,cb)=>{
  const data=parseSession(req);
  if(data){
    req.user=data;
    cb(true,data,()=>{})
  }
  else{
  cb(false,data,()=>{
    res.setHeader('content-type','application/json');
    res.writeHead(400)
    res.end(JSON.stringify({error:'not allowed'}));})
  }
}

module.exports={login,signup,authenticate};
