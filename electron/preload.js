const { contextBridge, ipcRenderer } = require("electron");

console.log("preload loaded");

contextBridge.exposeInMainWorld("windowControls", {
    minimize: () => ipcRenderer.send("window:minimize"),

    close: () => ipcRenderer.send("window:close"),
});
