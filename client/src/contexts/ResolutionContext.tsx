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
import {
  API_ACHIEVE_GOAL_URL,
  API_ASSIGN_EVENT_TO_GOAL_URL,
  API_COMPLETE_GOAL_URL,
  API_CREATE_GOAL_URL,
  API_CREATE_RESOLUTION_URL,
  API_DELETE_GOAL_URL,
  API_DELETE_RESOLUTION_URL,
  API_READ_RESOLUTION_URL,
  API_UPDATE_GOAL_DESCRIPTION_URL,
  API_UPDATE_RESOLUTION_URL,
} from "../constants/apiEndpoints";

/**
 * The type of a resolution object.
 * 
 * @category Object Types
 */
export interface Resolution {
  /**
   * Id of resolution
   */
  id: string;
  /**
   * Title of resolution
   */
  title: string;
  /**
   * Description of resolution
   */
  description: string;
  /**
   * List of goals attached to resolution
   */
  goals: Goal[];
  /**
   * Number of goals completed for the resolution
   */
  goals_completed: number;
  /**
   * Total number of goals contained by the resolution
   */
  goal_count: number;
}

/**
 * The type of a goal object.
 * 
 * @category Object Types
 */
export interface Goal {
  /**
   * Id of goal
   */
  id: string;
  /**
   * Description of goal
   */
  description: string;
  /**
   * Times to achieve for goal
   */
  nTimesToAchieve: number;
  /**
   * Whether goal is completed or not
   */
  completed: boolean;
  /**
   * Goal eventID
   */
  eventID?: string;
}

/**
 * The object accessed through ResolutionContext.
 * 
 * @category Contexts
 */
export interface ResolutionContextInterface {
  /**
   * List of resolutions of current user.
   */
  resolutions: Resolution[];
  /**
   * Function that calls the backend API to create a resolution in the database.
   * 
   * @param title - Resolution title
   * @param description - Resolution description
   */
  addResolution: (title: string, description: string) => void;
  /**
   * Function that calls the backend API to delete a resolution from the database then fetches to update current list of resolutions.
   * 
   * @param key - Key of resolution to delete
   */
  deleteResolution: (key: string) => void;
  /**
   * Function that calls the backend API to update an existing resolution in the database then fetches to update current list of resolutions.
   * 
   * @param key - Key of resolution to update
   * @param new_title - New resolution title
   * @param new_description - New resolution description
   */
  updateResolution: (
    key: string,
    new_title: string,
    new_description: string
  ) => void;
  /**
   * Function that gets the resolution given an id.
   * 
   * @param id - Id of resolution to search for or undefined
   * @returns The resolution linked to that id or undefined if the resolution with this id does not exist or if the id is undefined
   */
  getResolutionById: (id: string | undefined) => Resolution | undefined;
  /**
   * Function that calls the backend API to add a goal for a given resolution in the database then fetches to update current list of resolutions.
   * 
   * @param resolution_key - Key of resolution to update
   * @param description - Description of new goal
   * @param timesToAchieve - Times to achieve of new goal
   * @param reminderFrequency - Reminder frequency of new goal
   * @param reminderTime - Reminder time of new goal if reminderFrequency is not None
   * @param reminderDay - Reminder day of new goal if weekly reminder
   * @param reminderDate - Reminder date of new goal if monthly reminder
   */
  addGoal: (
    resolution_key: string,
    description: string,
    timesToAchieve: number,
    reminderFrequency: ReminderFrequency,
    reminderTime: Dayjs,
    reminderDay: Weekday,
    reminderDate: number
  ) => void;
  /**
   * Function that calls the backend API to achieve a goal for a given resolution in the database then fetches to update current list of resolutions.
   * 
   * @param resolution_key - Key of resolution to update
   * @param goal_key - Key of goal to achieve
   */
  achieveGoal: (resolution_key: string, goal_key: string) => void;
  /**
   * Function that calls the backend API to complete a goal for a given resolution in the database then fetches to update current list of resolutions.
   * 
   * @param resolution_key - Key of resolution to update
   * @param goal_key - Key of goal to complete
   * @param complete - True for complete goal, false for incomplete goal
   * @returns 
   */
  setGoalCompleted: (
    resolution_key: string,
    goal_key: string,
    complete: boolean
  ) => void;
  /**
   * Function that calls the backend API to delete a goal for a given resolution in the database then fetches to update current list of resolutions.
   * 
   * @param resolution_key - Key of resolution to update
   * @param goal_key - Key of goal to delete
   * @param event_id - Goal eventID
   * @returns 
   */
  deleteGoal: (
    resolution_key: string,
    goal_key: string,
    event_id: string
  ) => void;
  /**
   * Function that calls the backend API to update a goal for a given resolution in the database then fetches to update current list of resolutions.
   * 
   * @param resolution_key - Key of resolution to update
   * @param goal_key - Key of goal to update
   * @param event_id - Goal eventID
   * @param new_description - New goal description
   * @returns 
   */
  updateGoal: (
    resolution_key: string,
    goal_key: string,
    event_id: string,
    new_description: string
  ) => void;
}

/**
 * React Context that provides fields listed in {@link ResolutionContextInterface}.
 * 
 * @group Contexts
 */
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

/**
 * Provides children components access to fields in {@link ResolutionContext}.
 * 
 * @group Components
 * @category Context Provider
 * @returns ResolutionProvider component
 */
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
        .get(`${API_READ_RESOLUTION_URL}?user_id=${currentUser.uid}`)
        .then((res) => {
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
        await axios.post(API_CREATE_RESOLUTION_URL, {
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
        await axios.post(API_DELETE_RESOLUTION_URL, {
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
        await axios.post(API_UPDATE_RESOLUTION_URL, {
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
        const response = await axios.post(API_CREATE_GOAL_URL, {
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
        await axios.post(API_ASSIGN_EVENT_TO_GOAL_URL, {
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
        await axios.post(API_ACHIEVE_GOAL_URL, {
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
        await axios.post(API_COMPLETE_GOAL_URL, {
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
        await axios.post(API_DELETE_GOAL_URL, {
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
        await axios.post(API_UPDATE_GOAL_DESCRIPTION_URL, {
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
