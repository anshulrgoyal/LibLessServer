const readLine = require('readline');
const https = require('http');
const URL = require('url');
const event = require('events');

class _event extends event { };

const e = new _event();
const start = Date.now();

let error = [];
let sucess = [];
let i = 0;
const argv = process.argv
const url = argv[2];
const flags = {
    time: 10,
    request: 200,
    method: 'get',
    body: null,
    statusCode: 200,
    interval: 1000
}
process.stdout.write(`
.__   __.   ______   .___________.        ___      .______   
|  \ |  |  /  __  \  |           |       /   \     |   _  \  
|   \|  | |  |  |  |  ---|  |----       /  ^  \    |  |_)  | 
|       | |  |  |  |     |  |          /  /_\  \   |   _  <  
|  |\   | |   --'  |     |  |         /  _____  \  |  |_)  | 
|__| \__|  \______/      |__|        /__/     \__\ |______/  
                                                            
`)
process.stdout.write('\n');
// const _interface=readLine.createInterface({
//     input:process.stdin,
//     output:process.stdout,
//     prompt:'>'
// })

// _interface.prompt()

// structure of command node file url --time time(in s) --request requestPerSecond --interval 1000 --method [post,get,put,delete,patch] --body string --statusCode [any valid status code for http]

const regex = /^--[a-z]*/gi
argv.forEach((argument, i, arr) => {
    if (regex.test(argument)) {
        argument = argument.replace('--', "");
        if (!regex.test(arr[i + 1])) {
            flags[argument] = arr[i + 1];
        }
        else {
            return;
        }
    }
    else {
        return;
    }

})
e.on('compeleted', function () {
    process.stdout.write(`Total Number Of request is ${error.length + sucess.length} `);
    process.stdout.write('\n')
    process.stdout.write(`Number of Sucessfull Request: ${sucess.length}  `)
    process.stdout.write('\n')
    process.stdout.write(`Number of UnSucessfull Request: ${error.length}   `)
    process.stdout.write('\n')
    process.stdout.write(`Time Taken For Test: ${(Date.now() - start) / 1000} s`)
    let sucessTime = sucess.map((el) => el.time);
    sucessTime = sucessTime.sort();
    process.stdout.write('\n'); process.stdout.write(`50% in ${sucessTime[Math.floor(sucessTime.length * 50 / 100)]}`)
    process.stdout.write('\n'); process.stdout.write(`55% in ${sucessTime[Math.floor(sucessTime.length * 55 / 100)]}`)
    process.stdout.write('\n'); process.stdout.write(`60% in ${sucessTime[Math.floor(sucessTime.length * 60 / 100)]}`)
    process.stdout.write('\n'); process.stdout.write(`65% in ${sucessTime[Math.floor(sucessTime.length * 65 / 100)]}`)
    process.stdout.write('\n'); process.stdout.write(`70% in ${sucessTime[Math.floor(sucessTime.length * 70 / 100)]}`)
    process.stdout.write('\n'); process.stdout.write(`75% in ${sucessTime[Math.floor(sucessTime.length * 75 / 100)]}`)
    process.stdout.write('\n'); process.stdout.write(`80% in ${sucessTime[Math.floor(sucessTime.length * 80 / 100)]}`)
    process.stdout.write('\n'); process.stdout.write(`85% in ${sucessTime[Math.floor(sucessTime.length * 85 / 100)]}`)
    process.stdout.write('\n'); process.stdout.write(`90% in ${sucessTime[Math.floor(sucessTime.length * 90 / 100)]}`)
    process.stdout.write('\n'); process.stdout.write(`95% in ${sucessTime[Math.floor(sucessTime.length * 95 / 100)]}`)
    process.stdout.write('\n'); process.stdout.write(`100% in ${sucessTime.pop()}`)

    process.stdout.write('\n')
process.exit(0)








})
ajax = (url, method, body = null, headers = { "Content-Type": "application/json" }, cb = () => { }) => {
    let responseData = "";
    return new Promise((resolve, reject) => {
        const parsedUrl = URL.parse(url, true);
        const options = {
            ...parsedUrl,
            method,
            headers: { ...headers, 'user-agent': 'liblessserver', connection: 'keep-alive' },

        }
        const time = Date.now();
        const req = https.request(options, (res) => {

            res.on('data', (data) => {
                responseData = responseData + data;
            })
            res.on('end', (data) => {
                cb(null, responseData, Date.now() - time, res.statusCode)
                resolve(responseData);
            })
        });
        if (typeof (body) == 'object') {
            req.write(JSON.stringify(body));
        }
        req.on('error', (err) => {
            cb(err, null, Date.now() - time);
            //reject(err)
        })

    });
}
const totals=flags.total?flags.total: Number(flags.time)*Number(flags.request)/1000;
let exe = -1;
let total=0;
const id = setInterval(_ => makeRequest(), flags.interval)
const makeRequest = () => {
    exe++;
    for (i = 0; i < flags.request; i++) {
        if (total >totals) {
            clearInterval(id)
            e.emit('compeleted', error, sucess);
            break;
        }
        else {
            ajax(url, flags.method, null, null, (err, data, time, statusCode) => {
                // console.log(data)
                // console.log(exe)
                total++;
                if (err) {
                    // console.log(err)
                    error.push({
                        time,
                        reqNo: i + 1,
                        exe
                    })
                }
                else {
                    if (statusCode == flags.statusCode) {
                        sucess.push({
                            time,
                            reqNo: i + 1,
                            exe
                        })
                    } else {
                        error.push({
                            time, reqNo: i + 1,
                            exe
                        })
                    }
                }

            })
        }
    }
}



