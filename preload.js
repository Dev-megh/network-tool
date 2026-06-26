const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("networkAPI", {

    sendRequest: (request) =>
        ipcRenderer.invoke("http-request", request),

    startUDP: (port) =>
        ipcRenderer.invoke("udp-start", port),

    onUDPMessage: (callback) =>
        ipcRenderer.on("udp-message",
            (_, data) => callback(data))

});