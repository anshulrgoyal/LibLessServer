'use strict'

const fs = require('fs');
const path = require('path');

let lib = {};

lib.create = (dir, record, data, cb = () => { }) => {
    const isDir = fs.existsSync(path.resolve(`${__dirname}/../.data/${dir}`))
    if (isDir) {
        fs.writeFile(path.resolve(`${__dirname}/../.data/${dir}/${record}.json`), JSON.stringify(data), (err) => {
            if (err) cb(err);
            else cb(null,data);
        });
    }
    else {
        fs.mkdir(path.resolve(`${__dirname}/../.data/${dir}`), function (err) {
            if (err) cb(err);
            else {
                fs.writeFile(path.resolve(`${__dirname}/../.data/${dir}/${record}.json`), JSON.stringify(data), (err) => {
                    if (err) cb(err);
                    else cb(null,data);
                });
            }
        })
    }
}
lib.delete = (dir, record, cb) => {
    const isDir = fs.existsSync(path.resolve(`${__dirname}/../.data/${dir}`))
    if (isDir) {
        fs.unlink(path.resolve(`${__dirname}/../.data/${dir}/${record}.json`), (err) => {
            cb(err);
        })
    }
    else {
        cb('delete failed no such directory or file exists');
    }
}
lib.read = (dir, record, cb) => {
    const isDir = fs.existsSync(path.resolve(`${__dirname}/../.data/${dir}`));
    if (isDir) {
        fs.readFile(path.resolve(`${__dirname}/../.data/${dir}/${record}.json`), (err, data) => {
            if (err) cb(err, null);
            else cb(err, JSON.parse(data.toString('utf-8')));
        })
    }
    else {
        cb('no such file or directory exists');
    }
}

lib.update=(dir,record,data,cb)=>{
    lib.read(dir,record,(err,oldData)=>{
     if(err) cb(err,null);
     else{
         lib.create(dir,record,{...oldData,...data},(err,data)=>{
             if(err) cb(err,null);
             else cb(err,data);
         })
     }
    })
}
module.exports = lib;
// lib.read('test', 'test',(err,data) => { console.log(err,data) });
