import { createSocket } from "node:dgram";

let socket;

function start(port, callback){
    socket = createSocket("udp4");
    socket.bind(port);
    socket.on("message",(msg)=>{
        callback(msg.toString());
    });

}

export { start };