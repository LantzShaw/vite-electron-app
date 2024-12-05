import { BrowserWindow, ipcMain, IpcMain } from 'electron'
import { log } from 'electron-log'

export default function setupSettingsHandler() {
  // ipcMain.on('change-title', (event, title) => {
  //   log('change-title', title)
  //   return title
  // })
  ipcMain.handle('change-title', (event, title) => {
    log('change title', title)
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })
}
