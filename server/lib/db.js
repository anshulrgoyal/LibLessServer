const net =require('net');




let lib={};
lib.create = (dir, record, data, cb = () => { }) => {
    let response='';
    const socket=net.connect({host:'localhost',port:4442})
    socket.on('data',(data)=>{
        response=JSON.parse(data.toString().split('\r\n')[1]);
    })
    socket.on('end',()=>{
        cb(null,response)
        socket.destroy();
    })
    socket.on('error',(err)=>{
        cb(err,null)
        socket.destroy()
    })
    const string=`delete\r\n${dir}\r\n${record}\r\n${JSON.stringify(data)}`
    socket.write(Buffer.from(string));
}
lib.create('tests','nothing Special',{'tes':"test"},(err,data)=>{
    console.log(err)
    console.log(data)
})
// lib.delete = (dir, record, cb) => {
//     const isDir = fs.existsSync(path.resolve(`${__dirname}/../.data/${dir}`))
//     if (isDir) {
//         fs.unlink(path.resolve(`${__dirname}/../.data/${dir}/${record}.json`), (err) => {
//             cb(err);
//         })
//     }
//     else {
//         cb('delete failed no such directory or file exists');
//     }
// }
// lib.read = (dir, record, cb) => {
//     const isDir = fs.existsSync(path.resolve(`${__dirname}/../.data/${dir}`));
//     if (isDir) {
//         fs.readFile(path.resolve(`${__dirname}/../.data/${dir}/${record}.json`), (err, data) => {
//             if (err) cb(err, null);
//             else cb(err, JSON.parse(data.toString('utf-8')));
//         })
//     }
//     else {
//         cb('no such file or directory exists');
//     }
// }

// lib.update=(dir,record,data,cb)=>{
//     lib.read(dir,record,(err,oldData)=>{
//      if(err) cb(err,null);
//      else{
//          lib.create(dir,record,{...oldData,...data},(err,data)=>{
//              if(err) cb(err,null);
//              else cb(err,data);
//          })
//      }
//     })
// }
module.exports = lib;