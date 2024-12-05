import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@renderer/components/ui/button'

const Home: FC = () => {
  const navigate = useNavigate()

  const navigateToDashboardScreen = () => {
    navigate('/dashboard')
  }

  const onTitleChange = () => {
    window.settingsAPI.changeTitle('New Title')
  }

  return (
    <>
      <Button onClick={navigateToDashboardScreen}>Button</Button>
      <Button onClick={onTitleChange}>Change Title</Button>
      {/* <button onClick={navigateToSettingsScreen}>settings</button> */}
    </>
  )
}

export default Home
