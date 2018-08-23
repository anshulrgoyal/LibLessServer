'use strict'

// required module 
const cluster=require('cluster');
const os=require('os')

// if the file is called for first time
if(cluster.isMaster){
    // giving out the process id for restart
    console.log('the process id is',process.pid)

    // creating a fork time the cpu cores
 for(let i=0;i<os.cpus().length;i++){
     cluster.fork();
 }

 // adding an event when a process detach or died
 cluster.on('exit',function(worker,code,signal){
     // checking if the process crashed for killed by admin or os
    if(code!=0 && !worker.exitedAfterDisconnect){
        console.log(`worker ${worker.id} crached restarting....`)
        // starting a new process
        cluster.fork();
    }
})
// adding zero downtime restart
process.on('SIGUSR2',()=>{
    // getting all the workers
    const workers=Object.values(cluster.workers)
    // creating recursive function
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
// if the file is called second time;
else{
    require('./server')
}
