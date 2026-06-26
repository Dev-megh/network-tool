export async function sendRequest(request){
    return await window.networkAPI.sendRequest(request);
}

export function startUDP(port){
    return window.networkAPI.startUDP(port);
}

export function onUDP(callback){
    window.networkAPI.onUDPMessage(callback);
}