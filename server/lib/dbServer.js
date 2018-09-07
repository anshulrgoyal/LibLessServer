const fs = require('fs');
const net = require('net');
const path = require('path');
const _db = require('./_db');
const db = {};
fs.readdirSync(path.resolve('./.data')).forEach((dir) => {
  db[dir] = {};
  fs.readdirSync(path.resolve('./.data/' + dir)).forEach((file) => {
    db[dir][file.split('.')[0]] = JSON.parse(fs.readFileSync(path.resolve('./.data/' + dir + '/' + file)));
  })
})
const server = net.createServer();
const handleMethod = (method, document, id, body, cb = () => {}) => {
  const permittedMethods = ['read', 'create', 'update', 'delete'];
  if (permittedMethods.includes(method)) {
    if (method === 'read') {
      if (document in db) {
        if (id in db[document]) {
          cb(null, db[document][id]);
        } else {
          cb('id not found', null);
        }
      } else {
        cb('document not found', null);
      }
    } else if (method === 'create') {
      if (body) {
        _db.create(document, id, body, (err, data) => {
          if (err) cb(err, null);
          else {
            if (document in db) {
              db[document][id] = body
            } else {
              db[document] = {};
              db[document][id] = body;
            }
          }
          cb(null, data);

        });
      } else {
        cb('please provide a body', null)
      }
    } else if (method === 'update') {
      if (body) {
        _db.update(document, id, body, (err, data) => {
          if (err) cb(err, null);
          else {
            db[document][id] = { ...db[document][id],
              ...body
            };
            cb(null, data);
          }
        })
      } else {
        cb('please provide a body', null)
      }
    } else if (method === 'delete') {
      if (body) {
        _db.delete(document, id, (err, data) => {
          if (err) cb(err, null);
          else {
            delete db[document][id];
            cb(null, null);
          }
        })
      }
    }
  } else {
    cb('invalid data acess method', null);
  }
}
server.on('connection', (socket) => {
  // socket.write('connected')
  socket.on('error', (err) => {
    console.log(err);
  })
  socket.on('data', (data) => {
    const stringData = data.toString();
    const [method, document, id, updates] = stringData.split('\r\n');
    let parseredBody = {};
    if (updates) {
      parseredBody = JSON.parse(updates);
    }
    handleMethod(method, document, id, parseredBody, (err, data) => {
      if (err) {
        socket.write('error\r\n' + err)
        socket.end();
        socket.destroy();
      } else {
        socket.write('data\r\n' + JSON.stringify(data));
        socket.end();
        socket.destroy();
      }
    });
  })
})

server.listen(4442, () => {
  console.log('db  started')
});
