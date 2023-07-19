// creating context API which contain global props, to use the user info who signed up globally for all components
// It will rap around the App component.

import { createContext, useReducer, useEffect } from 'react';
import { projectAuth } from '../firebase/config';

// newly created context object named AuthContext
export const AuthContext = createContext();


// reducer function is used to update states of context.
// action contains the new values of the state, to which states have to be updated
export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload }
        case 'LOGOUT':
            return { ...state, user: null }
        case 'AUTH_IS_READY':
            return { ...state, user: action.payload, authIsReady: true}
        default:
            return state
    }
}

// This function as a component will be used to rap the App component, which indeed contains all nested components
// children are all descendent components of the component, from where this function is called
// that is all components, which would be rapped by AuthContextProvider

// {children} here represents app component, in index.js we can see inside AuthContextProvider we called <app/>
// This app component contain all children component required in the application.
export const AuthContextProvider = ({ children }) => {

    // using reducer function, to change state inside context.
    // dispatch function is used to call the reducer function here authReducer
    // so , the new value of the states are mentioned in the dispatch function 
    // and this dispatch function internally calls the reducer function with the new values of the state
    // so that reducer function could update the states, with the newly passed values.
    // dispatch passes 2 parameter as an object to reducer - {type(this mentins which state is to be changed) and payload(this contain new value of state) }
    // remember dispatch function can only be used to change states values
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        // user is a state, which will get updated to the value of the user data when he will Signup or Login
        authIsReady: false
        // authIsReady, will be true when, there is a user currently logged in
        // but he/she refreshes the page.
    })


    // This useEffect is used to log in the user who has been logged in, but refreshed the page.
    // Generally in react apps, refreshing means starting the app with initial render.
    useEffect(() => {
        // This function is called, whenever there is a auth status change in the firebase
        // so this function will also run, when user refresh a page, and again an initial render is performed
        // But it will also run, when a new user logs in or sign in.
        // Remember this user in the parameter is extracted from the firebase.
        const unsubscribe = projectAuth.onAuthStateChanged((user) => {
            dispatch( { type: 'AUTH_IS_READY', payload: user } )
            unsubscribe()
        })
        // unsubscribe is a const which stores a function, returned by onAuthStateChanged
        // after executing this function, dispatch will NOT be called further.

    }, [])

    console.log('AuthContext state: ', state)

    return (
        // This value is the prop which will act as a global prop, which can be accessed by any component
        // Without internal prop drilling
        // dispatch function is send inorder to change the state from any component.
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    )
}