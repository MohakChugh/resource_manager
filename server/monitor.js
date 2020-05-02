const os = require('os');
const osu = require('node-os-utils')
const axios = require('axios')
const cpu = osu.cpu

function monitor() {
    // Calculating Memory Usage
    percentage_memory_available = (os.freemem() / os.totalmem());
    percentage_memory_available *= 100;
    console.log(`Memory Usage Percentage is :-> ${percentage_memory_available}%`);
    
    // Calculating CPU Usage
    cpu_usage = 0;
    console.log(`The Average CPU load in the last 15 minutes is : ${os.loadavg()[2]*10}%`);
    cpu.usage().then(result => {
        cpu_usage = result
        console.log(`The CPU Utilization is :-> ${result}%`);
    });


    // Api Request if CPU USAGE is high
    if(cpu_usage > 1) {
        console.table(`CPU USAGE VERY HIGH`)
        // Make an API REQUEST to the database
        axios.default.post('http://15.206.170.227:8080/', {
            cpu_usage: cpu_usage,
            percentage_memory_available: percentage_memory_available,
            high: 'cpu'
        })
    }

    // Api Request if MEMORY USAGE is high
    if(percentage_memory_available > 1) {
        console.table(`MEMORY USAGE VERY HIGH`)
        // Make an API Request to the database
        axios.default.post('http://15.206.170.227:8080/', {
            cpu_usage: cpu_usage,
            percentage_memory_available: percentage_memory_available,
            high: 'memory'
        })
    }
}


setInterval(() => {
    monitor();
}, 1000 * 60 * 2); // 2 mins