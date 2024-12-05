import { IpcMain } from 'electron'
import ElectronStore from 'electron-store'
import Store from 'electron-store'

const store = new Store<ElectronStore<Record<string, any>>>({
  // const store = new Store({
  // defaults: {
  //   products: [],
  // },
})

export default function setupStoreHandler(ipcMain: IpcMain) {
  // ipcMain.handle('store-get', (_, key: string) => {
  //   return store.get(key)
  // })
  // ipcMain.handle('store-set', (_, key: string, value: any) => {
  //   return store.set(key, value)
  // })
  // ipcMain.handle('store-delete', (_, key: string) => {
  //   return store.delete(key)
  // })
  // ipcMain.handle('store-clear', () => {
  //   return store.clear()
  // })
}
