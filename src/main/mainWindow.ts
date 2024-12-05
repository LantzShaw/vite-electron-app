import { BrowserWindow } from 'electron'
import path from 'path'

export const createMainWindow = (): BrowserWindow => {
  return new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
}
