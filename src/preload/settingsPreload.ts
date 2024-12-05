import { contextBridge, ipcRenderer } from 'electron'

export default function setupSettingsPreload() {
  contextBridge.exposeInMainWorld('settingsAPI', {
    changeTitle: (title: string) => {
      return ipcRenderer.invoke('change-title', title)
      //  return ipcRenderer.send('change-title', title)
    },
  })
}
