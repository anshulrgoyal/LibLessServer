const readLine = require('readline');
const https = require('https');
const http = require('http');
const URL = require('url');
const event = require('events');
const {
  ajax
} = require('./helper')
class _event extends event {};

const e = new _event();
let start = Date.now();

let error = [];
let sucess = [];
let i = 0;
const argv = process.argv
let url = argv[2];
const flags = {
  time: 10,
  request: 200,
  method: 'get',
  body: null,
  statusCode: 200,
  interval: 1000,
  quesAns: false,
}
const title = `
ÛÛÛÛÛ       ÛÛÛÛÛÛÛÛÛÛ ÛÛÛÛÛÛÛÛÛÛÛ  ÛÛ  ÛÛÛÛÛÛÛÛÛ        ÛÛÛÛÛÛÛ    ÛÛÛÛÛ   ÛÛÛÛÛ ÛÛÛÛÛÛÛÛÛÛ ÛÛÛÛÛÛÛÛÛÛÛ   ÛÛÛÛÛ          ÛÛÛÛÛÛÛ      ÛÛÛÛÛÛÛÛÛ   ÛÛÛÛÛÛÛÛÛÛ
°°ÛÛÛ       °°ÛÛÛ°°°°°Û°Û°°°ÛÛÛ°°°Û ÛÛÛ ÛÛÛ°°°°°ÛÛÛ     ÛÛÛ°°°°°ÛÛÛ °°ÛÛÛ   °°ÛÛÛ °°ÛÛÛ°°°°°Û°°ÛÛÛ°°°°°ÛÛÛ °°ÛÛÛ         ÛÛÛ°°°°°ÛÛÛ   ÛÛÛ°°°°°ÛÛÛ °°ÛÛÛ°°°°ÛÛÛ
°ÛÛÛ        °ÛÛÛ  Û ° °   °ÛÛÛ  ° °°° °ÛÛÛ    °°°     ÛÛÛ     °°ÛÛÛ °ÛÛÛ    °ÛÛÛ  °ÛÛÛ  Û °  °ÛÛÛ    °ÛÛÛ  °ÛÛÛ        ÛÛÛ     °°ÛÛÛ °ÛÛÛ    °ÛÛÛ  °ÛÛÛ   °°ÛÛÛ
°ÛÛÛ        °ÛÛÛÛÛÛ       °ÛÛÛ        °°ÛÛÛÛÛÛÛÛÛ    °ÛÛÛ      °ÛÛÛ °ÛÛÛ    °ÛÛÛ  °ÛÛÛÛÛÛ    °ÛÛÛÛÛÛÛÛÛÛ   °ÛÛÛ       °ÛÛÛ      °ÛÛÛ °ÛÛÛÛÛÛÛÛÛÛÛ  °ÛÛÛ    °ÛÛÛ
°ÛÛÛ        °ÛÛÛ°°Û       °ÛÛÛ         °°°°°°°°ÛÛÛ   °ÛÛÛ      °ÛÛÛ °°ÛÛÛ   ÛÛÛ   °ÛÛÛ°°Û    °ÛÛÛ°°°°°ÛÛÛ  °ÛÛÛ       °ÛÛÛ      °ÛÛÛ °ÛÛÛ°°°°°ÛÛÛ  °ÛÛÛ    °ÛÛÛ
°ÛÛÛ      Û °ÛÛÛ °   Û    °ÛÛÛ         ÛÛÛ    °ÛÛÛ   °°ÛÛÛ     ÛÛÛ   °°°ÛÛÛÛÛ°    °ÛÛÛ °   Û °ÛÛÛ    °ÛÛÛ  °ÛÛÛ      Û°°ÛÛÛ     ÛÛÛ  °ÛÛÛ    °ÛÛÛ  °ÛÛÛ    ÛÛÛ
ÛÛÛÛÛÛÛÛÛÛÛ ÛÛÛÛÛÛÛÛÛÛ    ÛÛÛÛÛ       °°ÛÛÛÛÛÛÛÛÛ     °°°ÛÛÛÛÛÛÛ°      °°ÛÛÛ      ÛÛÛÛÛÛÛÛÛÛ ÛÛÛÛÛ   ÛÛÛÛÛ ÛÛÛÛÛÛÛÛÛÛÛ °°°ÛÛÛÛÛÛÛ°   ÛÛÛÛÛ   ÛÛÛÛÛ ÛÛÛÛÛÛÛÛÛÛ
°°°°°°°°°°° °°°°°°°°°°    °°°°°         °°°°°°°°°        °°°°°°°         °°°      °°°°°°°°°° °°°°°   °°°°° °°°°°°°°°°°    °°°°°°°    °°°°°   °°°°° °°°°°°°°°°
`


process.stdout.write(['\033[', 91, 'm', title, '\033[0m'].join(''))
process.stdout.write('\n');
const _interface = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '>'
})
// structure of command node file url --time time(in s) --request requestPerSecond --interval 1000 --method [post,get,put,delete,patch] --body string --statusCode [any valid status code for http]

const regex = /^--[a-z]*/gi
argv.forEach((argument, i, arr) => {
  if (regex.test(argument)) {
    argument = argument.replace('--', "");
    if (!regex.test(arr[i + 1])) {
      flags[argument] = arr[i + 1];
    } else {
      flags[argument] = true;
    }
  } else {
    return;
  }

})
e.on('compeleted', function() {
  process.stdout.clearLine()
  process.stdout.write('\n')
  process.stdout.write(`Total Number Of request is ${error.length + sucess.length} `);
  process.stdout.write('\n')
  process.stdout.write(`Number of Sucessfull Request: ${sucess.length}  `)
  process.stdout.write('\n')
  process.stdout.write(`Number of UnSucessfull Request: ${error.length}   `)
  process.stdout.write('\n')
  process.stdout.write(`Time Taken For Test: ${(Date.now() - start) / 1000} s`)
  let sucessTime = sucess.map((el) => el.time);
  let stat = [];
  let begin = 50;
  for (var i = 1; i < 11; i++) {
    stat.push({
      'probability': `${begin+i*5}%`,
      'time in ms': sucessTime[Math.floor(sucessTime.length * (begin + i * 5) / 100) - 1]
    })
  }
  process.stdout.write('\n')
  console.table(stat)
  process.stdout.write('\n')
  process.exit(0)

})
const time = Date.now();


e.on('start', () => {
  let dots = ''
  setInterval(function() {
    process.stdout.clearLine(); // clear current text
    process.stdout.cursorTo(0); // move cursor to beginning of line
    dots += '.'
    process.stdout.write("Overloading" + dots); // write text
  }, 300);

  start = Date.now()
  const totals = flags.total ? flags.total : Number(flags.time) * Number(flags.request) / 1000;
  let exe = -1;
  let total = 0;
  const id = setInterval(_ => makeRequest(), flags.interval)
  const makeRequest = () => {
    exe++;
    for (i = 0; i < flags.request; i++) {
      if (total > totals) {
        clearInterval(id)
        e.emit('compeleted', error, sucess);
        break;
      } else {
        ajax(url, {}, (err, data, time, statusCode) => {
          total++;
          if (err) {
            console.log(err)
            error.push({
              time,
              reqNo: i + 1,
              exe
            })
          } else {
            if (statusCode == flags.statusCode) {
              sucess.push({
                time,
                reqNo: i + 1,
                exe
              })
            } else {
              error.push({
                time,
                reqNo: i + 1,
                exe
              })
            }
          }

        })
      }
    }
  }
})
if (argv.length > 3) {
  e.emit('start')
} else {
  _interface.question('Enter the Url\n>', (ans) => {
    url = ans;
    _interface.question('Enter the number of Request per second\n>', (ans) => {
      flags.request = ans;
      _interface.question('Enter the duration of the benchmark\n>', (ans) => {
        flags.time = ans;
        _interface.question('Enter the total number of request\n>', (ans) => {
          flags.total = ans
          e.emit('start');
        })
      })
    })
  });
}
