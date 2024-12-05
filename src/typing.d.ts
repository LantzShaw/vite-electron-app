export type SettingsApi = {
  changeTitle: (title: string) => Promise<void>
}

export type ThemeAPI = {
  toggle: () => Promise<boolean>
  system: () => Promise<void>
}

declare global {
  interface Window {
    themeAPI: ThemeAPI
    settingsAPI: SettingsApi
  }
}
