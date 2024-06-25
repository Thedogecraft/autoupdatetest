const { ipcRenderer, ipcMain } = require('electron')
const { exec } = require('child_process')
const os = require('os')
const fs = require('fs')
const path = require('path')
const { stdout, stderr } = require('process')
ipcMain.on('updatePowerPlan', (event, arg) => {
  exec(`powercfg -import ${resourcesPath}/powerplan.pow`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    console.log(`stdout: ${stdout}`)
    console.error(`stderr: ${stderr}`)
  })
  const psScriptPath = path.join(resourcesPath + '/powerplan.ps1')
  console.log(psScriptPath)
  exec(`powershell.exe -ExecutionPolicy Bypass -File "${psScriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    console.log(`stdout: ${stdout}`)
    console.error(`stderr: ${stderr}`)
  })
})

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
function getUsername() {
  return os.userInfo().username
}
console.log('Resources path:', resourcesPath)

ipcMain.on('removeXboxOverlay', (event) => {
  exec(
    `powershell Get-AppxPackage Microsoft.XboxGamingOverlay | Remove-AppxPackage`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        event.reply('removeXboxOverlayResponse', {
          success: false,
          message: `exec error: ${error}`
        })
        return
      }
      console.log(`stdout: ${stdout}`)
      if (stderr) {
        console.error(`stderr: ${stderr}`)
      }
      event.reply('removeXboxOverlayResponse', {
        success: true,
        message: 'Xbox overlay removed successfully.'
      })
    }
  )
})

ipcMain.on('pcBoost', () => {
  console.log('pcBoost sent')

  const processesToKill = [
    'firefox.exe',
    'chrome.exe',
    'opera.exe',
    'ctfmon.exe',
    'OneDrive.exe',
    'NewsAndInterests.exe',
    'GrooveMusic.exe',
    'Spotify.exe',
    'vdb.exe',
    'gamingservices.exe',
    'RuntimeBroker.exe',
    'spoolsv.exe',
    'GitHubDesktop.exe',
    'Rainmeter.exe'
  ]

  processesToKill.forEach((process) => {
    exec(`taskkill /F /im ${process}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error killing ${process}: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`Standard error for ${process}: ${stderr}`)
        return
      }
      console.log(`Killed ${process}`)
    })
  })

  const tempFolders = [
    path.join(process.env.WINDIR, 'Temp'),
    path.join(process.env.USERPROFILE, 'AppData', 'Local', 'Temp')
  ]

  tempFolders.forEach((tempFolder) => {
    fs.readdir(tempFolder, (err, files) => {
      if (err) {
        console.error(`Error reading directory ${tempFolder}: ${err.message}`)
        return
      }

      files.forEach((file) => {
        const filePath = path.join(tempFolder, file)
        fs.rm(filePath, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error(`Error deleting file ${filePath}: ${err.message}`)
            return
          }
          console.log(`Deleted ${filePath}`)
        })
      })
    })
  })

  console.log('Done.')
})
