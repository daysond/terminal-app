
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

    const signup = async (email, password, confirm) => {
        
        if(password !== confirm) {
            setError("Please make sure your passwords match.")
            return {signup, isLoading, error}
        }
        
        setIsLoading(true)
        setError(null)

        console.log("[DEBUG] Signing up...")

        const response = await fetch('http://api-server/api/user/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
        
        try {
            const json = await response.json()
    
            if(!response.ok) {
                setIsLoading(false)
                setError(json.error)
            
            } else {
                // save the user to local storage 
                // TODO: Change it to redis ??
                localStorage.setItem('user', JSON.stringify(json))
                
                // update auth context
                dispatch({type:"logged_in", payload: json})
                setIsLoading(false)
            }
            
        } catch (error) {
            setIsLoading(false)
            setError(`${response.status}: ${response.statusText}`)
        }

    }

    return {signup, isLoading, error}
}