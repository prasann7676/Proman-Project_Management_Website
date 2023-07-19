// This hook is used to real-time display the projects, (for the projects that are clicked form the dashboard)
// on the /projects/:id url
import { useEffect, useState } from "react"
import { projectFirestore } from "../firebase/config"

import {doc, onSnapshot} from "firebase/firestore";


// we want the id of the project to be displayed also.
export const useDocument = (collec, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  // realtime document data
  useEffect(() => {
    // reference to the particular document inside a particular collection with a particular id.
    const ref = doc(projectFirestore, collec, id)

    // onSnapshot is used to get realtime data of the documents, whenever the document changes(or even when it was first made)
    const unsubscribe = onSnapshot(ref, snapshot => {

      // if the snapshot(document) with the particular id, has no data(i.e the project details is not being created, with this id)
      // need to make sure the doc exists & has data
      if(snapshot.data()) {
        setDocument({...snapshot.data(), id: snapshot.id})
        setError(null)
      }
      else { 
        // if not document with the id exists, we will throw an error
        // remember we are handling error maually because, firestore donot give an error, when no document(with particular id) is being found 
        setError('No such document exists')
      }
    }, err => {
      console.log(err.message)
      setError('failed to get document')
    })

    // unsubscribe from realtime data fetching on unmounting.
    return () => unsubscribe()

  }, [collec, id])

  return { document, error }
}