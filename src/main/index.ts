import { BrowserWindow, app, ipcMain } from 'electron'
import path from 'path'
import started from 'electron-squirrel-startup'

import { setupSettingsHandler, setupStoreHandler, setupThemeHandler } from './ipcHandlers'
import { createMainWindow } from './mainWindow'

const platform = process.platform // 'darwin' | 'win32' | 'linux'
const isPackaged = app.isPackaged

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require("electron-squirrel-startup")) {
//   app.quit()
// }

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit()
}

const createWindow = (): void => {
  const mainWindow: BrowserWindow = createMainWindow()

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  // setupStoreHandler(ipcMain)
  // setupThemeHandler(ipcMain)

  // setupStoreHandler()
  setupThemeHandler()
  setupSettingsHandler()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// NOTE: 官方推荐使用 whenReady()
// app.on("ready", createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
