'use strict'


const cluster=require('cluster');
const os=require('os')

if(cluster.isMaster){
    console.log('the process id is',process.pid)
 for(let i=0;i<os.cpus().length;i++){
     cluster.fork();
 }
 cluster.on('exit',function(worker,code,signal){
    if(code!=0 && !worker.exitedAfterDisconnect){
        console.log(`worker ${worker.id} crached restarting....`)
        cluster.fork();
    }
})
process.on('SIGUSR2',()=>{
    const workers=Object.values(cluster.workers)
    const restart=(workerIndex)=>{
        const worker=workers[workerIndex];
        if(!worker) return;
        worker.on('exit',()=>{
            if(!worker.exitedAfterDisconnect) return;
            cluster.fork().on('listening',()=>{
                console.log('restarted ',workerIndex)
                restart(workerIndex++);
            });
        })
        worker.disconnect();
    }
    restart(0)
})
}

else{
    require('./server')
}
