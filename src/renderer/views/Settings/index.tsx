import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

type SettingsProps = {}

const Settings: FC<SettingsProps> = () => {
  const navigate = useNavigate()

  const navigateBack = () => {
    navigate('/')
  }

  return (
    <>
      <h2>Settings Screen</h2>
      <button onClick={navigateBack}>go back</button>
    </>
  )
}

export default Settings
