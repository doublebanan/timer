const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const isDev = !app.isPackaged;

function createWindow() {
    const win = new BrowserWindow({
        width: 760,
        height: 402,
        frame: false,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    win.webContents.on("did-finish-load", () => {
        win.show();
    });
    if (isDev) {
        win.loadURL("http://localhost:3000");
        win.webContents.openDevTools({ mode: "detach" });
    } else {
        win.loadFile(path.join(__dirname, "..", "build", "index.html"));
    }
}

ipcMain.on("window:minimize", (e) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (win) win.minimize();
});

ipcMain.on("window:close", (e) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (win) win.close();
});

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
