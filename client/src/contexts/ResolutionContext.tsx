import { createContext, useState } from 'react';

let initialResolutions = [
    {
        id: "1",
        title: "Eat Healthy",
        description: "Trying to eat more greens.",
        goals_completed: 3,
        goal_count: 5
    },
    {
        id: "2",
        title: "Exercise More",
        description: "Trying to gain muscle.",
        goals_completed: 1,
        goal_count: 5
    },
    {
        id: "3",
        title: "Rest More",
        description: "Trying to sleep 8 hours a night.",
        goals_completed: 1,
        goal_count: 1
    }
]

export interface Resolution {
    id: string,
    title: string,
    description: string,
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