// This custom hook, gives all the documents (and error if any) specific to the collection, que made and in which order we want.
// If no query adn orderby is passed then this will return all the documents in this particular collection.(so atleast 1 parameter(of collection) should be specified)
import { useEffect, useState, useRef } from 'react';
import { projectAuth, projectFirestore } from '../firebase/config';
import { collection, query, where, onSnapshot } from "firebase/firestore"; 

export const useCollection = (collec, _que, _orderBy) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);

    console.log("output",_que, _orderBy)

    // que is an array, which have info specific to the user who is currently logged in.
    const que = useRef(_que).current
    // without this useEffect will stuck into an infinite loop, because _que is an array.
    // So, whenever the que or the collection changes, this array values are treated as different, every time
    // or say _que is an array and id different on every function call.
    // to deal with this infinite loop due to useEffect being called, useRef is used

    const orderBy = useRef(_orderBy).current

    // useEffect is used to real-time listen to the collection changes.
    // so whenever the collection changes, we want the changed collection to be shown in the home page
    useEffect(() => {
        // let ref = projectFirestore.collection(collection)

        let ref = query(collection(projectFirestore, collec))

        // ref = query(ref)

        // console.log("orderBy", orderBy)

        if(que) {
            ref = query(ref, where(...que))
            // This where is an inbuilt firestore function
            // we only want collection of the user with a certain userid(who is currently logged in)
        }

        if(orderBy) {
            ref = query(ref, orderBy(...orderBy))
            // This orderBy is a function to diplay the documents (here transactions) in a specific order.
        }

        // so this function would be called whenever the collection is being altered
        // for ex - when we add a document, or say when deleted, or updated a document or a new user is being logged in, in other device
        // also it will be first called while creating one.
        const unsubscribe = onSnapshot(ref, (snapshot) => {
            let result = []
            //.docs accesses the collection of documents, which is returned as a snapshot
            snapshot.forEach((doc) => {
                result.push({...doc.data(), id: doc.id}) 
                // this id is not uid(this was for the user)
                // whereas, id is a unique id for a particular document, inside a collection of a particular user
            })

            // updating the document state accoording to the snapshot, to be in sync
            setDocuments(result)
            setError(null)
        }, (error) => {
            console.log(error);
            setError('Could not Fetch the Data')
        })
        // 2nd argument to the snapshot function is to handle errors

        // unsubscribe on unmount
        return () => unsubscribe()

    }, [collec, que, orderBy]) 
    // those variable or state is kept in the dependency array which comes from outside
    //(i.e not defined inside useEffect ahould be included in the dependency array)

    return { documents, error }

}