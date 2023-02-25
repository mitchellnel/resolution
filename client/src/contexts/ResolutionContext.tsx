import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

export interface Resolution {
    id: string,
    title: string,
    description: string,
    goals_completed: number,
    goal_count: number
}

export interface ResolutionContextInterface {
    resolutions: Resolution[],
    addResolution: (title: string, description: string) => void
    deleteResolution: (key: string) => void
    getResolutionById: (id: string | undefined) => Resolution | undefined
}

export const ResolutionContext = createContext<ResolutionContextInterface>({
    resolutions: [],
    addResolution: () => null,
    deleteResolution: () => null, 
    getResolutionById: () => undefined
});

interface ResolutionProviderProps {
    children: React.ReactNode
}

export const ResolutionProvider = ({ children } : ResolutionProviderProps) => {

    const { currentUser } = useContext(UserContext);

    const [resolutions, setResolutions] = useState<Resolution[]>([]);

    // fix type of APIData from any type
    // converts APIData, which is an object with ids as keys to an array of resolution objects, which each have an id property
    const convertAPIDataToResolutions = (APIData : any): Resolution[] => {
        const resolutions = []
        for (const resolutionId in APIData) {
            resolutions.push({...APIData[resolutionId], id: resolutionId, goals_completed: 0, goal_count: 0})
        }
        return resolutions
    }

    const fetchAPI = useCallback(() => {
        if (currentUser) {
            axios.get(`/api/read-resolution?user_id=${currentUser.uid}`)
            .then(res => {
                setResolutions(convertAPIDataToResolutions(res.data.resolutions));
            }).catch(err => {
                console.log('Fetch Error:', err);
            })
        }
    }, [currentUser])

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

    const callAPIDeleteResolution = async (key: string) => {
        try {
            if (currentUser) {
                await axios.post('/api/delete-resolution', {
                    'user_id': currentUser.uid,
                    'firebase_key': key,
                    // 'description': description
                })
            }
        } catch (err) {
            console.log('Create Error:', err);
        }
    }

    useEffect(() => {
        fetchAPI();
    }, [currentUser, fetchAPI])

    const addResolution = async (title: string, description: string) => {
        await callAPICreateResolution(title, description);
        fetchAPI();
    }

    const deleteResolution = async (key: string) => {
        await callAPIDeleteResolution(key);
        fetchAPI();
    }

    // returns a Resolution if a Resolution with the id exists, otherwise return undefined
    const getResolutionById = (id: string | undefined) => {
        return resolutions.find(resolution => resolution.id === id)
    }

    const value = { resolutions, addResolution, deleteResolution, getResolutionById };

    return <ResolutionContext.Provider value={value}>{children}</ResolutionContext.Provider>
}