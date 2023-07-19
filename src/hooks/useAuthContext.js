// A custom hook which return the authContext after checking if it is not null.

import { AuthContext } from "../context/AuthContext"
import { useContext } from "react" //useContext is an inbuilt hook

export const useAuthContext = () => {
    // Authcontext contains { states, dispatch }.
    const context = useContext(AuthContext)

    if(!context) {// if it is null, that means its value is being used outside its scope (outside rapped children)
        throw Error('useAuthContext must be inside an AuthContextProvider');
    }

    return context
}