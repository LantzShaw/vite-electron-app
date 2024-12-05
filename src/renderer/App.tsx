import { FC, useState } from 'react'

const App: FC = () => {
  const [count, setCount] = useState(0)
  const [themeMode, setThemeMode] = useState<string>('system')

  const onIncreaseClick = () => {
    setCount(count + 1)
  }

  const onDecreaseClick = () => {
    setCount(count - 1)
  }

  const onToggleTheme = async () => {
    const isDarkMode = await window.theme.toggle()

    setThemeMode(isDarkMode ? 'dark' : 'light')
  }

  const onResetTheme = () => {
    window.theme.system()
    setThemeMode('system')
  }

  return (
    <>
      <h2>App Screen</h2>
      <p>{count}</p>
      <button onClick={onDecreaseClick}>Decrease</button>
      <button onClick={onIncreaseClick}>Increase</button>

      <button onClick={onToggleTheme}>toggle theme</button>
      <button onClick={onResetTheme}>system</button>
      <div>current mode: {themeMode}</div>
    </>
  )
}

export default App
