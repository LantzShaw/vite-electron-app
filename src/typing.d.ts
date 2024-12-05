export {}

declare global {
  interface Window {
    theme: {
      toggle: () => Promise<boolean>
      system: () => Promise<void>
    }
  }
}
