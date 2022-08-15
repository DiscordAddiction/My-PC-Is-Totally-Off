const { app, BrowserWindow, powerSaveBlocker } = require('electron')
const path = require('path');
const DiscordRPC = require("discord-rpc");

function createWindow () {
  const win = new BrowserWindow({
    width: 2000,
    height: 2000,
    frame: false,
    alwaysOnTop: true,
    fullscreen: true,
    icon: path.join(__dirname, 'icon.ico'),
  })

  win.loadFile('index.html')

  app.setLoginItemSettings({
    openAtLogin: true
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
      powerMonitor.on("lock-screen", () => {
        powerSaveBlocker.start("prevent-display-sleep");
      });
      powerMonitor.on("suspend", () => {
        powerSaveBlocker.start("prevent-app-suspension");
      });
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const clientId = '1006773530735693994';

DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

rpc.on('ready', () => {
  rpc.setActivity({
    state: 'My PC is totally off',
    startTimestamp,
    largeImageKey: 'image',
    buttons: [{label: "Download", url: "https://github.com/DiscordAddiction/My-PC-Is-Totally-Off/releases/tag/0.0.1"}],
    instance: false,
  });
})

rpc.login({ clientId }).catch(console.error);