import { useState } from 'react'
import Account from 'src/models/Account'
import createAccount from 'lib/createAccount'
import getUpdatedAccount from './getUpdatedAccount'

const initialAccountValue = createAccount()

/**
 * Bug fix: Handling promise errors
 */
const useAccount = (): [Account, () => Promise<void>] => {
  const [account, setAccount] = useState<Account>(initialAccountValue)
  const refreshAccount = async () => {
    try {
      const res = await getUpdatedAccount(account)
      setAccount(res)
    }
    catch (error) {
      setAccount({ calendars: account.calendars, errorMessage: true }) 
    }
  }
  
  return [account, refreshAccount]
}

export default useAccount
