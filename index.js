// netstat windows 
const { exec } = require('child_process');

// Execute netstat command
exec('netstat -ano', (err, stdout, stderr) => {
    if (err) {
        console.error(`exec error: ${err}`);
        return;
    }

    // Fetch all processes
    exec('tasklist', (errTasklist, stdoutTasklist) => {
        if (errTasklist) {
            console.error(`exec error: ${errTasklist}`);
            return;
        }

        // Split output into lines
        const lines = stdout.split('\n');

        lines.forEach(line => {
            // Extract columns (Protocol, Local Address, Foreign Address, State, PID)
            const parts = line.trim().split(/\s+/);
            if (parts.length === 5) {
                const [protocol, localAddress, foreignAddress, state, pid] = parts;

                if (state === 'LISTENING') {
                    const [ip, port] = localAddress.split(':');

                    // Find the process in the tasklist
                    const processLine = stdoutTasklist.split('\n').find(l => l.includes(pid));
                    const processName = processLine ? processLine.split(/\s+/)[0] : 'Unknown';

                    console.log(`Protocol: ${protocol}`);
                    console.log(`Local IP: ${ip}`);
                    console.log(`Port: ${port}`);
                    console.log(`PID: ${pid}`);
                    console.log(`Program: ${processName}`);
                    console.log('-------------------');
                }
            }
        });
    });
});
