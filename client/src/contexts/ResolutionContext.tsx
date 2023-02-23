import { createContext, useState } from 'react';

let initialResolutions = [
    {
        title: "Eat Healthy",
        goals_completed: 3,
        goal_count: 5
    },
    {
        title: "Exercise More",
        goals_completed: 1,
        goal_count: 5
    },
    {
        title: "Rest More",
        goals_completed: 1,
        goal_count: 1
    }
]

export interface Resolution {
    title: string,
    goals_completed: number,
    goal_count: number
}

export interface ResolutionContextInterface {
    resolutions: Resolution[],
    setResolutions: React.Dispatch<React.SetStateAction<Resolution[]>>
}

export const ResolutionContext = createContext<ResolutionContextInterface>({
    resolutions: [],
    setResolutions: () => null
});

interface ResolutionProviderProps {
    children: React.ReactNode
}

export const ResolutionProvider = ({ children } : ResolutionProviderProps) => {

    const [resolutions, setResolutions] = useState<Resolution[]>(initialResolutions);

    const value = { resolutions, setResolutions };

    return <ResolutionContext.Provider value={value}>{children}</ResolutionContext.Provider>
}