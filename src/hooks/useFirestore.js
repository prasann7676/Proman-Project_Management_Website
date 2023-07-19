// Custom hook, to do CRUD operation on firestore database.
import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";
import { collection, doc, addDoc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";


let initalState = {
    document: null,
    isPending: false,
    error: null,
    success: null
}

const firestoreReducer = (state, action) => {
    switch (action.type){
        case 'IS_PENDING':
            return { isPending: true, document: null, success: false, error: null }
        case 'ADDED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null} // no ...state as all states are handled manually
        case 'ERROR':
            return { isPending: false, document: null, success: false, error: action.payload }
        case 'DELETED_DOCUMENT':
            return { isPending: false, document: null, success: true, error: null }
        case 'UPDATED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null }
        default: 
            return state 
    }
}

// collection are like tables in sql
export const useFirestore = (collec) => {
    // here response is a state name, which have 4 attributes - document, isPending, error and success.
    const [response, dispatch] = useReducer(firestoreReducer, initalState)
    const [isCancelled, setIsCancelled] = useState(false)

    // accessing the collection named ref
    // If not yet made firestore will first create the collection
    const ref = collection(projectFirestore, collec)

    // only dispatch only if not cancelled
    const dispatchIfNotCancelled = (action) => {
        if(!isCancelled){
            dispatch(action)
        }
    }

    // add a document in firestore database
    // This doc is parameter which is the object to be added in the collection
    // This object is passed in the TransactionForm file, in the handleSubmit function
    const addDocument = async (document) => {
        dispatch({ type: 'IS_PENDING' })// to change the isPending to true

        try {
            // This createdAt will be used to display the order of the transaction in the home page 
            const createdAt = serverTimestamp()

            const addedDocument = await addDoc(ref, { ...document, createdAt })
            // we are adding the doc object with the times of creating it in the firebase.
            dispatchIfNotCancelled( {type: 'ADDED_DOCUMENT', payload: addedDocument} )
            
        }
        catch(err){
            dispatchIfNotCancelled( {type: 'ERROR', payload: err.message} )
        }

    }

    // delete a document from firestore database
    const deleteDocument = async (id) => {
        dispatch({ type: 'IS_PENDING' })

        try {
            //res.doc(id) will give us a specific document with the given id
            await deleteDoc(doc(projectFirestore, collec, id))

            dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })

        }
        catch(err) {
            dispatchIfNotCancelled({ type: 'ERRoR', payload: 'could not delete' })
        }
    } 

    // update documents
    const updateDocument = async (id, updates) => {
        // updates are the values that need to be updated in the document


        dispatch({ type: 'IS_PENDING' })

        const updatedDocument = await updateDoc(doc(projectFirestore, collec, id) ,updates)
        .then(() => {
            // we only need to update if isCancelled is false
            console.log("updateDocument->", updatedDocument)
            dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updatedDocument })
            return updatedDocument
        })
        .catch((err) => {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err })
            return null
        })
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { addDocument, deleteDocument, updateDocument, response }

}