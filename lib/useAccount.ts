import { useState } from 'react'

import Account from 'src/models/Account'
import createAccount from 'lib/createAccount'

import getUpdatedAccount from './getUpdatedAccount'

const initialAccountValue = createAccount()

const useAccount = (): [Account, () => Promise<void>] => {
  const [account, setAccount] = useState<Account>(initialAccountValue)
  const refreshAccount = async () => {
    try {
      const res = await getUpdatedAccount(account)
      setAccount(res)
      // console.log(res)
    }
    catch (error) {
      setAccount({
        calendars: account.calendars,
        errorMessage: error.message
      })
      // console.log('Error getting new data')
    }
  }
  
  return [account, refreshAccount]
}

export default useAccount
