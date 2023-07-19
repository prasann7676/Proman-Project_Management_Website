// hooks folder contains all custom made hooks
// This useSignup is also a custom hook used to signup the user in thr firestore and store the data of the suer in the storage
// This hook is imported in Signup.js to use its functionality

import { useState, useEffect } from 'react';
import { projectAuth, projectStorage, projectFirestore } from '../firebase/config';

// useAuthContext returns the context object will contain the {state, dispatch}
import { useAuthContext } from './useAuthContext';
import { doc, setDoc } from "firebase/firestore"; 
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";


export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();
    const [isCancelled, setIsCancelled] = useState(); 

    // This signup function will basically invoke when a user submit the sign up form
    const signup = async (email, password, displayName, thumbnail) => {
        setError(null) // reset the error after every form submit
        setIsPending(true) // At this point of time, till ending of the function it will be in loading state

        try {
            // signup the user, if there would be an error while signing up using createUserWithEmailAndPassword
            // the the catch part will come into action
            // This is an inbuilt function, which reaches out the firebase Auth and tries to sign that user
            // with the particular email and password in the parameter.

            let res="";

            await createUserWithEmailAndPassword(projectAuth, email, password) // await means, the execution of the function will not move futher untill this line is being executed respose.user is the user that is just created in the firebase.
                        .then((cred) => {
                            res = cred
                            console.log('user-created',cred.user)
                        })
                        .catch((err) => {
                            console.log(err.message)
                        })
                        
            console.log("res = ",res);

            if(!res){ // res is NULL
                throw new Error("Error in signing up") //after this error also control will go back to the catch state
            }

            // upload user thumbnail
            // uploadPath is the path in the storage area of the firestore where the thumbnail will be stored
            // therefore the thumbnails would be stored inside the storage section, inside the thumbnails folder
            // and for every user(folder denoting by their user id) there would be their thumbnail stored.
            // so if there is no thumbnails folder, it will automatically create it, same for subforlders as well
            const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`

            //ref(reference) is a an inbuilt function which take a reference to the path of where the data(here thumbnail) should be uploaded in the firebase storage
            const img = ref(projectStorage, uploadPath)

            await uploadBytes(img, thumbnail)
            .then((snapshot) => {
                console.log('Uploaded a blob or file!');
            });

            let imgUrl;
            // now img.ref gives us the path and getDownloadURL creates a URL in firebase storage and return it. 
            await getDownloadURL(img)
            .then((url) => {
                console.log("url in getDownLoad->",url)
                imgUrl = url
            })
            .catch((err) => {
                console.log("error in uploading Thumbnail")
            })


            // Till here no error in signing up


            // user default donot have the displayName property in firebase
            // therefore we have to add displayName to the user
            // updareProfile add the displayName to the current user profile
            // photoURL is the thumbnail/avatar of the user
            await updateProfile(projectAuth.currentUser, {displayName: displayName, photoURL: imgUrl})

            // creating a user document in the firestore
            // we dont use add method here, to add a document, as we dont want, forestore to automatically assign a document id to the document
            // rather we want the document id equal to the user id, so as to search for the document id according to the user and upload a thumbnail of the user.
            // If the id passed into the doc, does not exists yet, then it will create it.
            // set actually tell the content of the document to be stored
            await setDoc(doc(projectFirestore, 'users', res.user.uid), {
                online: true, //to find if a certain user if online or offline
                displayName: displayName, // to display the name of the user who currently logged in
                photoURL: imgUrl // to display the thumbnail of the logged in user
            })

            // dispathing login action, which update the user state.
            // as whenever some signup, they autpmatically also login to the website
            // this displatch function calls the reducer function in the AuthContext
            dispatch( {type: 'LOGIN', payload: res.user} );

            if(!isCancelled){
                setIsPending(false)
                setError(null)
            }
        }
        catch (err) { // if error in signing up
            if(!isCancelled){
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }
        }
    }

    useEffect(() => {
        // cleanup function
        return () => setIsCancelled(true);

    }, [])

    return { error, isPending, signup }
}