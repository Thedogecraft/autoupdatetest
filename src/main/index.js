import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import './actions.js'
const { autoUpdater, AppUpdater } = require('electron-updater')
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/sparkle.png'
const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const os = require('os')

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1469,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    icon: { icon },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  let maximizeToggle = false // toggle back to original window size if maximize is clicked again
  ipcMain.on('manualMinimize', () => {
    mainWindow.minimize()
  })
  ipcMain.on('manualMaximize', () => {
    if (maximizeToggle) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
    maximizeToggle = !maximizeToggle // flip the value of maximizeToggle
  })
  ipcMain.on('manualClose', () => {
    app.quit()
  })
  ipcMain.on('run-command', (event, command) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`)
        return
      }
      console.log(`Command output: ${stdout}`)
      event.sender.send('command-output', stdout) // Send output back to Renderer process if needed
    })
  })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.parcoil.sparkle')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  autoUpdater.checkForUpdates()
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

const appPath = app.getAppPath()

// Construct the path to the resources folder

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

function getUsername() {
  return os.userInfo().username
}

// Function to download a file
async function downloadPowerPlanFile(url, outputPath) {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  })

  const writer = fs.createWriteStream(outputPath)

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

// Path to the resources folder in your Electron app
const username = getUsername()
const resourcesPath = path.join(
  'C:',
  'Users',
  username,
  'AppData',
  'Local',
  'Programs',
  'sparkle',
  'resources'
)

// URL of the power plan file to download
const powerPlanFileUrl = 'https://github.com/Parcoil/files/raw/main/sparklepowerplan.pow'

// Name of the power plan file after download
const powerPlanFileName = 'powerplan.pow'

// Full path to save the power plan file
const powerPlanFilePath = path.join(resourcesPath, powerPlanFileName)

// Download the power plan file and save it to the resources folder
downloadPowerPlanFile(powerPlanFileUrl, powerPlanFilePath)
  .then(() => {
    console.log(`Power plan file downloaded successfully to: ${powerPlanFilePath}`)
  })
  .catch((err) => {
    console.error('Error downloading power plan file:', err)
  })
