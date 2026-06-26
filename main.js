import { BrowserWindow, app } from "electron";
import { ipcMain } from "electron";
import { sendRequest } from "./backend/http.js";
import path from "node:path";
import { start } from "./backend/udp.js";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const window = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    window.loadFile("renderer/index.html");
}


ipcMain.handle("udp-start",(_,port)=>{
    start(port,(data)=>{
        BrowserWindow
            .getAllWindows()[0]
            .webContents
            .send("udp-message",data);
    });
});

ipcMain.handle("http-request", (_, config)=>{
    return sendRequest(config);
});

app.whenReady().then(createWindow);