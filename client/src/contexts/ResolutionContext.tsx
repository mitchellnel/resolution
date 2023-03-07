import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

export interface Resolution {
    id: string,
    title: string,
    description: string,
    goals: Goal[],
    goals_completed: number,
    goal_count: number
}

export interface Goal {
    id: string,
    description: string,
    completed: boolean
}

export interface ResolutionContextInterface {
    resolutions: Resolution[],
    addResolution: (title: string, description: string) => void
    deleteResolution: (key: string) => void
    updateResolution: (key: string, new_title: string, new_description: string) => void
    getResolutionById: (id: string | undefined) => Resolution | undefined
}

export const ResolutionContext = createContext<ResolutionContextInterface>({
    resolutions: [],
    addResolution: () => null,
    deleteResolution: () => null, 
    updateResolution: () => null,
    getResolutionById: () => undefined
});

interface ResolutionProviderProps {
    children: React.ReactNode
}

interface ResolutionsReducerState {
    resolutions : Resolution[],
}

enum RESOLUTIONS_ACTION_TYPES {
    SET_RESOLUTIONS = 'SET_RESOLUTIONS',
}

//fix payload type
interface ResolutionsReducerAction {
    type: RESOLUTIONS_ACTION_TYPES,
    payload: Resolution[]
}

const INITIAL_STATE : ResolutionsReducerState = {
    resolutions : [],
}

const resolutionsReducer = (state : ResolutionsReducerState, action : ResolutionsReducerAction) => {
    const { type, payload } = action;

    switch(type) {
        //payload is just resolutions array
        case RESOLUTIONS_ACTION_TYPES.SET_RESOLUTIONS:
            return {
                ...state,
                resolutions: (payload as Resolution[])
            }
        default:
            throw new Error(`unhandled type of ${type} in resolutionsReducer`);
    }
}

export const ResolutionProvider = ({ children } : ResolutionProviderProps) => {

    const { currentUser } = useContext(UserContext);

    const [ { resolutions }, dispatch ] = useReducer(resolutionsReducer, INITIAL_STATE);

    const setResolutions = (new_resolutions : Resolution[]) => {
        dispatch({ type: RESOLUTIONS_ACTION_TYPES.SET_RESOLUTIONS, payload: new_resolutions });
    }

    // fix type of APIData from any type
    // converts APIData, which is an object with ids as keys to an array of resolution objects, which each have an id property
    const convertAPIDataToResolutions = (APIData : any): Resolution[] => {
        const resolutions = []
        for (const resolutionId in APIData) {
            resolutions.push({...APIData[resolutionId], id: resolutionId, goals: convertAPIDataToGoals(APIData[resolutionId].goals), goals_completed: 0, goal_count: 0})
        }
        return resolutions
    }

    // fix type of APIData from any type
    // converts APIData, which is an object with ids as keys to an array of goal objects, which each have an id property
    const convertAPIDataToGoals = (APIData : any): Goal[] => {
        const goals = []
        for (const goalId in APIData) {
            goals.push({...APIData[goalId], id: goalId})
        }
        return goals
    }

    const fetchAPI = useCallback(() => {
        if (currentUser) {
            axios.get(`/api/read-resolution?user_id=${currentUser.uid}`)
            .then(res => {
                console.log(convertAPIDataToResolutions(res.data.resolutions));
                setResolutions(convertAPIDataToResolutions(res.data.resolutions));
            }).catch(err => {
                console.log('Fetch Error:', err);
            })
        }
    }, [currentUser])

    useEffect(() => {
        fetchAPI();
    }, [currentUser, fetchAPI])


    //create functionality:
    const callAPICreateResolution = async (title: string, description: string) => {
        try {
            if (currentUser) {
                await axios.post('/api/create-resolution', {
                    'user_id': currentUser.uid,
                    'title': title,
                    'description': description
                })
            }
        } catch (err) {
            console.log('Create Error:', err);
        }
    }

    const addResolution = async (title: string, description: string) => {
        await callAPICreateResolution(title, description);
        fetchAPI();
    }

    //delete functionality:
    const callAPIDeleteResolution = async (key: string) => {
        try {
            if (currentUser) {
                await axios.post('/api/delete-resolution', {
                    'user_id': currentUser.uid,
                    'firebase_key': key,
                })
            }
        } catch (err) {
            console.log('Delete Error:', err);
        }
    }

    const deleteResolution = async (key: string) => {
        await callAPIDeleteResolution(key);
        fetchAPI();
    }

    const callAPIUpdateResolution = async (key: string, new_title: string, new_description: string) => {
        try {
            if (currentUser) {
                await axios.post('/api/update-resolution', {
                    'user_id': currentUser.uid,
                    'firebase_key': key,
                    'new_title': new_title,
                    'new_description': new_description
                })
            }
        } catch (err) {
            console.log('Update Error:', err);
        }
    }

    const updateResolution = async (key: string, new_title: string, new_description: string) => {
        await callAPIUpdateResolution(key, new_title, new_description);
        fetchAPI();
    }

    // returns a Resolution if a Resolution with the id exists, otherwise return undefined
    const getResolutionById = (id: string | undefined) => {
        return resolutions.find(resolution => resolution.id === id)
    }

    const value = { resolutions, addResolution, deleteResolution, updateResolution, getResolutionById };

    return <ResolutionContext.Provider value={value}>{children}</ResolutionContext.Provider>
}