import { useState, useEffect } from 'react'
import { getUserByUserId } from '../services/firebase'
//get logged in user
export default function useUser(userId) {
  const [activeUser, setActiveUser] = useState()

  useEffect(() => {
    async function getUserObjByUserId(userId) {
      const [user] = await getUserByUserId(userId)
      setActiveUser(user || {})
    }
    if (userId) {
      getUserObjByUserId(userId)
    }
  }, [userId])

  return { user: activeUser, setActiveUser }
}