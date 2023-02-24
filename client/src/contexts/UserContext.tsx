import { User } from 'firebase/auth';
import { createContext, useState, useEffect } from 'react';

export interface UserContextInterface {
    currentUser: User | null,
    authenticated: boolean,
    setCurrentUser: React.Dispatch<React.SetStateAction<User>> | React.Dispatch<React.SetStateAction<null>>,
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

export const UserContext = createContext<UserContextInterface>({
        currentUser: null,
        authenticated: false,
        setCurrentUser: () => null,
        setAuthenticated: () => null
    });

interface UserProviderProps {
    children: React.ReactNode
  }

export const UserProvider = ({ children } : UserProviderProps) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if(!authenticated){
            setCurrentUser(null);
        }
    }, [authenticated])

    const value = { currentUser, authenticated, setCurrentUser, setAuthenticated };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}