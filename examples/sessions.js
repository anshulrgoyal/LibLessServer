/**
*EXAMPLE for sessions
*/
const crypto=require('crypto')

let db={};
/**
* create a new session
*/

createSession=(res)=>{
  res.setHeader('Set-Cookie',`sessionId=${_createSessionId().toString('hex')}`);
  res.setHeader('Expires',Date.now()+8400000);
}

parseSession=(req)=>{
  const {headers:{Cookie}}=req;
  return _getSessionData(Cookie);
}

_createSessionId=()=>{
  const id=crypto.randomBytes(12);
  if(id in db){
    return createSession();
  }
  else{
    db[id]={lastAccess:Date.now()}
    return id;
  }
}
/**
*@param id is string
*/
_getSessionData=(id)=>{
  if(id in db){
    return db[id];
  }
  else{
    return null;
  }
}

/**
*@param id string of id
*@param updates object
*/
updateSession=(id,updates)=>{
  if(id in db){
    db[id]={...db[id],...updates,lastAccess:Date.now()}
    return db[id];
  }else{
    return null;
  }
}
/**
*@param id string
*/
deleteSession=(id)=>{
  if(id in db){
    db[id]=null;
    return true;
  }
  else{
    return null;
  }
}

// setInterval(()=>{
//   Object.keys(db).forEach((element,i)=>{
//     if(db[element].lastAccess<Date.now()+8400000){
//       db[element]=null;
//     }
//   })
// },1000)



module.exports={parseSession,createSession,updateSession,deleteSession};
