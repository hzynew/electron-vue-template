'use strict'
const path = require('path')
const { app, BrowserWindow } = require('electron')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:8080`
  : `file://${path.resolve(__dirname, 'dist/index.html')}`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 726,
    useContentSize: true,
    width: 1366,
    // frame: false
    webPreferences: {// 官方在5.0版本修改了nodeIntegration的默认值
      nodeIntegration: true
    }
  })
  mainWindow.loadURL(winURL)
  // mainWindow.loadFile('../index.html')
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development')
    mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  console.log(`--------------certificate-error----------------------`);
  console.log(event);
  console.log(`--------------error----------------------`);
  console.log(error);
  console.log(`--------------url----------------------`);
  console.log(url);
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
