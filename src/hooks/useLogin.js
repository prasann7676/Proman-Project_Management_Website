import { useState, useEffect } from 'react'
import { projectAuth, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  // function to login the user into the firebase database
  const login = async (email, password) => {
    setError(null)
    setIsPending(true)
  
    try {
      // login
      const res = await signInWithEmailAndPassword(projectAuth, email, password)

      // updating the user to be online
      const uid = res.user.uid
      // await projectFirestore.collection('users').doc(uid).update({ online: true })
      await updateDoc(doc(projectFirestore, "users", uid) ,{ online: true });

      console.log(res.user)

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    // if someones refreshes the page when the login process is going on. Then we will make isCancelled as true.
    return () => setIsCancelled(true)
  }, [])

  return { login, isPending, error }
}