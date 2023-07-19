// A customAuth hook, which trigger the logout action in the firebase

import { useState, useEffect } from 'react';
import { projectAuth, projectFirestore } from '../firebase/config';
import { useAuthContext } from './useAuthContext';
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export const useLogout = () => {
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch, user } = useAuthContext();
    const [isCancelled, setIsCancelled] = useState(); 
    // used for cleanup function. so as to cancel all async work going on in the background after unmounting of the component.
    

    // This function will be invoked when user click the logout button from the navbar
    const logout = async () => {
        setError(null);
        setIsPending(true);

        try {
            // update the status of the user from online to offline
            const { uid } = user

            console.log(uid)

            // .doc(uid) will returns us the document with id as uid, then we will update the docuemnt.
            await updateDoc(doc(projectFirestore, "users", uid) ,{ online: false });

            console.log("no error")

            // This function signs the user out of the firebase.
            await signOut(projectAuth);


            // dispatch logout action
            // here no need of payload to be passed as there is no user dependency in logout.
            dispatch( {type: 'LOGOUT'} )

             // only when the unmounting(navgiating to some other component in the DOM) is not done
             // then only we will set the loading state to false and error to null
            if(!isCancelled){
                setIsPending(false)
                setError(null)
            }
        }   
        catch(err) {
            if(!isCancelled){
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }
        }
    }

    // cleanup function is used to handle, the asynchronous fetch(here logout) going on, even if the component is unmounted
    // or say when during the logout period, we navigate to other route/component, so technically our logout component should be unmounted
    // but the asynchronous logout hook, still tries to update the DOM, which throws an error.
    // so cleanup function immidiately triggers when the unmounting happens.
    // cleanup function can only be defined inside a useEffect hook.
    useEffect(() => {
        // cleanup function
        return () => setIsCancelled(true);

    }, []) // This useEffect hook will only trigger in the initial render, as an empty dependency(array) is being passed as a second argument

    return { logout, error, isPending}
}