import { contextBridge, ipcRenderer } from "electron";

export function setupStorePreload() {
    contextBridge.exposeInMainWorld("store", {
        storeGet: (key: string) => ipcRenderer.invoke("store-get", key),
        storeSet: (key: string, val: any) => ipcRenderer.invoke("store-set", key, val),
        storeDelete: (key: string) => ipcRenderer.invoke("store-delete", key),
        storeClear: () => ipcRenderer.invoke("store-clear")
    })
}