import { ipcMain, IpcMain, nativeTheme } from 'electron'
import { log } from 'electron-log'

export default function themeHandler() {
  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }

    log('dark-mode:toggle', nativeTheme.shouldUseDarkColors)

    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })
}
