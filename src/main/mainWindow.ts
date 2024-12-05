import { BrowserWindow } from 'electron'
import path from 'path'

export const createMainWindow = (): BrowserWindow => {
  return new BrowserWindow({
    height: 1080,
    width: 1920,
    webPreferences: {
      // sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })
}
