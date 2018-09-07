const http=require('http');
const {login,authenticate,signup}=require('./login');
const URL = require('url');
const StringDecoder=require('string_decoder').StringDecoder;

const server=http.createServer();

server.on('request',(req,res)=>{
  const {method,url}=req;
  const {pathname}=URL.parse(url);
  let buffer="";
  const decoder=new StringDecoder('utf-8');
  req.on('data',(data)=>{
    buffer+=decoder.write(data);
  })

   req.on('end',(data)=>{
     buffer+=decoder.end();
     const trimmedUrl=pathname.replace(/^\/|\/$/g,"");
     console.log(trimmedUrl)
     switch (trimmedUrl) {
       case 'login':
       let {username,password}=JSON.parse(buffer);
         login(username,password,res,(err,foundUser)=>{
           res.writeHead(200);
           res.setHeader('content-type','application/json');
           res.end({foundUser});
         })
         break;
         case 'wonder':
           authenticate(req,res,(status,details,automate)=>{
               automate();
               if(status){
                 res.end({data})
               }
           });
           break;
         case 'signup':
         let payload=JSON.parse(buffer);
          signup(payload.username,payload.password,res,(err,user)=>{
            res.setHeader('content-type','application/json')
            res.writeHeader(200)
            res.write(JSON.stringify(user))
          })
             break;
       default:
       res.end();
     }
   })

})

server.listen(3000)
