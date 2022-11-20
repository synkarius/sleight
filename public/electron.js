const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
mainWindow = new BrowserWindow({ width: 1080, height: 720 });
    mainWindow.loadURL(isDev ? "http://localhost:3000": 
        `file://${path.join(__dirname, "../build/index.html")}`);

    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// remove the electron menu
// other ways to do this: https://stackoverflow.com/questions/69629262/how-can-i-hide-the-menubar-from-an-electron-app
Menu.setApplicationMenu(null);