import { useState } from 'react'
import { DateTime } from 'luxon'

const useHour = (): [number, () => void] => {
  const [hour, setHour] = useState<number>(DateTime.local().hour)
  const refreshHour = () => {
    setHour(DateTime.local().hour)
  }
  
  return [hour, refreshHour]
}

export default useHour
