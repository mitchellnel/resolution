import { User } from 'firebase/auth';
import { createContext, useEffect, useReducer } from 'react';
import apiCalendar from '../calendar/googleCalendar';
import { onAuthStateChangedListener } from '../utils/firebase';

export interface UserContextInterface {
    currentUser: User | null,
    authenticated: boolean,
}

export const UserContext = createContext<UserContextInterface>({
        currentUser: null,
        authenticated: false,
    });

interface UserProviderProps {
    children: React.ReactNode
  }

enum USER_ACTION_TYPES {
    SIGN_IN = 'SIGN_IN',
    SIGN_OUT = 'SIGN_OUT'
}

interface UserReducerActionWithoutPayload {
    type: USER_ACTION_TYPES
}

interface UserReducerActionWithPayload {
    type: USER_ACTION_TYPES
    payload: User
}

interface UserReducerState {
    currentUser: User | null
    authenticated: boolean
}

const INITIAL_STATE : UserReducerState = {
    currentUser: null,
    authenticated: false
}

const userReducer = (state : UserReducerState, action : UserReducerActionWithPayload | UserReducerActionWithoutPayload) => {
    const { type } = action;

    switch(type) {
        //payload is just User
        case USER_ACTION_TYPES.SIGN_IN:
            const { payload } = action as UserReducerActionWithPayload;
            return {
                ...state,
                currentUser: payload,
                authenticated: true
            }
        case USER_ACTION_TYPES.SIGN_OUT:
            return {
                ...state,
                currentUser: null,
                authenticated: false
            }
        default:
            throw new Error(`unhandled type of ${type} in userReducer`);
    }
}

export const UserProvider = ({ children } : UserProviderProps) => {

    const [ { authenticated, currentUser }, dispatch ] = useReducer(userReducer, INITIAL_STATE);


    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user : User | null) => {
            if (user){
                // prompt user to sign-in to Google Calendar API
                apiCalendar.handleAuthClick();
                
                dispatch({type: USER_ACTION_TYPES.SIGN_IN, payload: user})
            }
            else {
                dispatch({type: USER_ACTION_TYPES.SIGN_OUT})
            }
        })
        return unsubscribe;
    }, [])

    const value = { currentUser, authenticated };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}