import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { ReminderFrequency, Weekday } from "../types";
import { Dayjs } from "dayjs";

import {
  createGoalEvent,
  deleteGoalEvent,
  updateGoalEventSummary,
} from "../calendar/goalCalendar";

export interface Resolution {
  id: string;
  title: string;
  description: string;
  goals: Goal[];
  goals_completed: number;
  goal_count: number;
}

export interface Goal {
  id: string;
  description: string;
  nTimesToAchieve: number;
  completed: boolean;
  eventID?: string;
}

export interface ResolutionContextInterface {
  resolutions: Resolution[];
  addResolution: (title: string, description: string) => void;
  deleteResolution: (key: string) => void;
  updateResolution: (
    key: string,
    new_title: string,
    new_description: string
  ) => void;
  getResolutionById: (id: string | undefined) => Resolution | undefined;
  addGoal: (
    resolution_key: string,
    description: string,
    timesToAchieve: number,
    reminderFrequency: ReminderFrequency,
    reminderTime: Dayjs,
    reminderDay: Weekday,
    reminderDate: number
  ) => void;
  achieveGoal: (resolution_key: string, goal_key: string) => void;
  setGoalCompleted: (
    resolution_key: string,
    goal_key: string,
    complete: boolean
  ) => void;
  deleteGoal: (
    resolution_key: string,
    goal_key: string,
    event_id: string
  ) => void;
  updateGoal: (
    resolution_key: string,
    goal_key: string,
    event_id: string,
    new_description: string
  ) => void;
}

export const ResolutionContext = createContext<ResolutionContextInterface>({
  resolutions: [],
  addResolution: () => null,
  deleteResolution: () => null,
  updateResolution: () => null,
  getResolutionById: () => undefined,
  addGoal: () => null,
  achieveGoal: () => null,
  setGoalCompleted: () => null,
  deleteGoal: () => null,
  updateGoal: () => null,
});

interface ResolutionProviderProps {
  children: React.ReactNode;
}

interface ResolutionsReducerState {
  resolutions: Resolution[];
}

enum RESOLUTIONS_ACTION_TYPES {
  SET_RESOLUTIONS = "SET_RESOLUTIONS",
}

//fix payload type
interface ResolutionsReducerAction {
  type: RESOLUTIONS_ACTION_TYPES;
  payload: Resolution[];
}

const INITIAL_STATE: ResolutionsReducerState = {
  resolutions: [],
};

const resolutionsReducer = (
  state: ResolutionsReducerState,
  action: ResolutionsReducerAction
) => {
  const { type, payload } = action;

  switch (type) {
    //payload is just resolutions array
    case RESOLUTIONS_ACTION_TYPES.SET_RESOLUTIONS:
      return {
        ...state,
        resolutions: payload,
      };
    default:
      throw new Error(`unhandled type of ${type} in resolutionsReducer`);
  }
};

export const ResolutionProvider = ({ children }: ResolutionProviderProps) => {
  const { currentUser } = useContext(UserContext);

  const [{ resolutions }, dispatch] = useReducer(
    resolutionsReducer,
    INITIAL_STATE
  );

  const setResolutions = (new_resolutions: Resolution[]) => {
    dispatch({
      type: RESOLUTIONS_ACTION_TYPES.SET_RESOLUTIONS,
      payload: new_resolutions,
    });
  };

  // fix type of APIData from any type
  // converts APIData, which is an object with ids as keys to an array of resolution objects, which each have an id property
  const convertAPIDataToResolutions = (APIData: any): Resolution[] => {
    const resolutions = [];
    for (const resolutionId in APIData) {
      const goals = convertAPIDataToGoals(APIData[resolutionId].goals);
      const goals_completed = goals.reduce(
        (accum, goal) => (goal.completed ? (accum += 1) : accum),
        0
      );
      resolutions.push({
        ...APIData[resolutionId],
        id: resolutionId,
        goals: goals,
        goals_completed: goals_completed,
        goal_count: goals.length,
      });
    }
    return resolutions;
  };

  // fix type of APIData from any type
  // converts APIData, which is an object with ids as keys to an array of goal objects, which each have an id property
  const convertAPIDataToGoals = (APIData: any): Goal[] => {
    const goals = [];
    for (const goalId in APIData) {
      goals.push({ ...APIData[goalId], id: goalId });
    }

    return goals;
  };

  const fetchAPI = useCallback(() => {
    if (currentUser) {
      axios
        .get(`/api/read-resolution?user_id=${currentUser.uid}`)
        .then((res) => {
          console.log(convertAPIDataToResolutions(res.data.resolutions));
          setResolutions(convertAPIDataToResolutions(res.data.resolutions));
        })
        .catch((err) => {
          //no fetch error could mean that the user just has no resolutions since their document gets deleted
          setResolutions([]);
          console.log("Fetch Error:", err);
        });
    } else {
      setResolutions([]);
    }
    // eslint-disable-next-line
  }, [currentUser]);

  useEffect(() => {
    fetchAPI();
  }, [fetchAPI]);

  //create resolution functionality:
  const callAPICreateResolution = async (
    title: string,
    description: string
  ) => {
    try {
      if (currentUser) {
        await axios.post("/api/create-resolution", {
          user_id: currentUser.uid,
          title: title,
          description: description,
        });
      }
    } catch (err) {
      console.log("Create Resolution Error:", err);
    }
  };

  const addResolution = async (title: string, description: string) => {
    await callAPICreateResolution(title, description);
    fetchAPI();
  };

  //delete resolution functionality:
  const callAPIDeleteResolution = async (key: string) => {
    try {
      if (currentUser) {
        await axios.post("/api/delete-resolution", {
          user_id: currentUser.uid,
          firebase_key: key,
        });
      }
    } catch (err) {
      console.log("Delete Resolution Error:", err);
    }
  };

  const deleteResolution = async (key: string) => {
    await callAPIDeleteResolution(key);
    fetchAPI();
  };

  //update resolution functionality:
  const callAPIUpdateResolution = async (
    key: string,
    new_title: string,
    new_description: string
  ) => {
    try {
      if (currentUser) {
        await axios.post("/api/update-resolution", {
          user_id: currentUser.uid,
          firebase_key: key,
          new_title: new_title,
          new_description: new_description,
        });
      }
    } catch (err) {
      console.log("Update Resolution Error:", err);
    }
  };

  const updateResolution = async (
    key: string,
    new_title: string,
    new_description: string
  ) => {
    await callAPIUpdateResolution(key, new_title, new_description);
    fetchAPI();
  };

  // returns a Resolution if a Resolution with the id exists, otherwise return undefined
  const getResolutionById = (id: string | undefined) => {
    return resolutions.find((resolution) => resolution.id === id);
  };

  //GOAL CRUD

  //create goal functionality:
  const callAPICreateGoal = async (
    resolution_key: string,
    description: string,
    timesToAchieve: number
  ): Promise<string | undefined> => {
    try {
      if (currentUser) {
        const response = await axios.post("/api/create-goal", {
          user_id: currentUser.uid,
          resolution_key: resolution_key,
          description: description,
          nTimesToAchieve: timesToAchieve,
        });

        return response.data.goal_key as string;
      }
    } catch (err) {
      console.log("Create Goal Error:", err);

      return undefined;
    }
  };

  const addGoal = async (
    resolution_key: string,
    description: string,
    timesToAchieve: number,
    reminderFrequency: ReminderFrequency,
    reminderTime: Dayjs,
    reminderDay: Weekday,
    reminderDate: number
  ) => {
    const goalKey = await callAPICreateGoal(
      resolution_key,
      description,
      timesToAchieve
    );

    if (reminderFrequency !== ReminderFrequency.None) {
      // provided this works, we will add a reminder to the user's calendar
      const eventID = await createGoalEvent(
        description,
        timesToAchieve,
        reminderFrequency,
        reminderTime,
        reminderDay,
        reminderDate
      );

      // assign the event ID to the Goal in the database
      await callAPIAssignEventIDToGoal(resolution_key, goalKey!, eventID);
    }

    fetchAPI();
  };

  // assign event ID to goal functionality
  const callAPIAssignEventIDToGoal = async (
    resolution_key: string,
    goal_key: string,
    eventID: string
  ) => {
    try {
      if (currentUser) {
        await axios.post("/api/assign-event-to-goal", {
          user_id: currentUser.uid,
          resolution_key: resolution_key,
          goal_key: goal_key,
          event_id: eventID,
        });
      }
    } catch (err) {
      console.log("Assign Event ID to Goal Error:", err);
    }
  };

  // achieve goal functionality
  const callAPIAchieveGoal = async (
    resolution_key: string,
    goal_key: string
  ) => {
    try {
      if (currentUser) {
        await axios.post("/api/achieve-goal", {
          user_id: currentUser.uid,
          resolution_key: resolution_key,
          goal_key: goal_key,
        });
      }
    } catch (err) {
      console.log("Achieve Goal Error:", err);
    }
  };

  const achieveGoal = async (resolution_key: string, goal_key: string) => {
    await callAPIAchieveGoal(resolution_key, goal_key);
    fetchAPI();
  };

  //complete goal functionality:
  const callAPICompleteGoal = async (
    resolution_key: string,
    goal_key: string,
    completed: boolean
  ) => {
    try {
      if (currentUser) {
        await axios.post("/api/complete-goal", {
          user_id: currentUser.uid,
          resolution_key: resolution_key,
          goal_key: goal_key,
          completed: completed,
        });
      }
    } catch (err) {
      console.log("Complete Goal Error:", err);
    }
  };

  const setGoalCompleted = async (
    resolution_key: string,
    goal_key: string,
    completed: boolean
  ) => {
    await callAPICompleteGoal(resolution_key, goal_key, completed);
    fetchAPI();
  };

  //delete goal functionality:
  const callAPIDeleteGoal = async (
    resolution_key: string,
    goal_key: string
  ) => {
    try {
      if (currentUser) {
        await axios.post("/api/delete-goal", {
          user_id: currentUser.uid,
          resolution_key: resolution_key,
          goal_key: goal_key,
        });
      }
    } catch (err) {
      console.log("Delete Goal Error:", err);
    }
  };

  const deleteGoal = async (
    resolution_key: string,
    goal_key: string,
    event_id: string
  ) => {
    await callAPIDeleteGoal(resolution_key, goal_key);

    // delete the Goal's event from the user's calendar
    if (event_id) {
      await deleteGoalEvent(event_id);
    }

    fetchAPI();
  };

  //update goal functionality:
  const callAPIUpdateGoal = async (
    resolution_key: string,
    goal_key: string,
    new_description: string
  ) => {
    try {
      if (currentUser) {
        await axios.post("/api/update-goal-description", {
          user_id: currentUser.uid,
          resolution_key: resolution_key,
          goal_key: goal_key,
          new_description: new_description,
        });
      }
    } catch (err) {
      console.log("Update Goal Description Error:", err);
    }
  };

  const updateGoal = async (
    resolution_key: string,
    goal_key: string,
    event_id: string,
    new_description: string
  ) => {
    await callAPIUpdateGoal(resolution_key, goal_key, new_description);

    if (event_id) {
      await updateGoalEventSummary(event_id, new_description);
    }

    fetchAPI();
  };

  const value = {
    resolutions,
    addResolution,
    deleteResolution,
    updateResolution,
    getResolutionById,
    addGoal,
    achieveGoal,
    setGoalCompleted,
    deleteGoal,
    updateGoal,
  };

  return (
    <ResolutionContext.Provider value={value}>
      {children}
    </ResolutionContext.Provider>
  );
};
