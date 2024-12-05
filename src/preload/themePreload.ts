import { contextBridge, ipcRenderer } from 'electron'

export default function setupThemePreload() {
  contextBridge.exposeInMainWorld('theme', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => {
      // NOTE: 这里可以返回结果
      return ipcRenderer.invoke('dark-mode:system')
    },
  })
}
