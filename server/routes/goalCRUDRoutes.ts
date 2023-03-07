import { Router, Request, Response } from "express";
import { ref, push, set, get } from "firebase/database";

import {
  API_COMPLETE_GOAL_ENDPOINT,
  API_CREATE_GOAL_ENDPOINT,
  API_READ_GOAL_ENDPOINT,
  API_UPDATE_GOAL_DESCRIPTION_ENDPOINT,
} from "../constants/apiEndpoints";
import {
  Goal,
  APICreateGoalArguments,
  apiCreateGoalArgumentsSchema,
  APICreateGoalReturn,
  APIReadGoalArguments,
  apiReadGoalArgumentsSchema,
  APIReadGoalReturn,
} from "../constants/apiInterfaces";
import { RTDB_RESOLUTIONS_PATH } from "../constants/firebaseRTDBPaths";

import { database } from "../utils/firebase";

const router: Router = Router();

interface ResolutionExistence {
  exists: boolean;
  error?: string;
}

const doesResolutionExist = async (
  user_id: string,
  resolution_key: string
): Promise<ResolutionExistence> => {
  // check that the Resolution pertaining to resolution_key actually exists
  const userRef = ref(database, RTDB_RESOLUTIONS_PATH + user_id);
  const userResolutions = await get(userRef);
  if (!userResolutions.exists()) {
    return {
      exists: false,
      error: `User with id ${user_id} has no resolutions`,
    };
  } else if (resolution_key in userResolutions.val() === false) {
    return {
      exists: false,
      error: `Resolution with key ${resolution_key} does not exist`,
    };
  }

  return { exists: true };
};

router.post(API_CREATE_GOAL_ENDPOINT, async (req: Request, res: Response) => {
  const data = req.body;

  // try to unwrap data into APICreateGoalArguments type
  try {
    // use yup ObjectSchema cast method to validate the request arguments
    // use validate to ensure that description is a required field
    const createData: APICreateGoalArguments =
      await apiCreateGoalArgumentsSchema.validate(data);

    const user_id = createData.user_id;
    const resolution_key = createData.resolution_key;

    const resolutionExists = await doesResolutionExist(user_id, resolution_key);
    if (resolutionExists.exists === false) {
      throw resolutionExists.error;
    }

    // create the object to add to the database
    const dataToAdd: Goal = {
      description: createData.description,
      complete: false,
    };

    // get reference to the database at the goals for the user's Resolution
    const userGoalsRef = ref(
      database,
      RTDB_RESOLUTIONS_PATH + user_id + "/" + resolution_key + "/goals"
    );

    // we use push to basically append to a list, and add to the new ref
    const newGoalRef = await push(userGoalsRef);

    try {
      await set(newGoalRef, dataToAdd);

      res.status(200).json({ success: true } as APICreateGoalReturn);
    } catch (err) {
      const logMessage = `Data Received: ${JSON.stringify(
        data
      )}\n\t ... FAILURE:  Could not add goal to database: ${err}`;

      res
        .status(500)
        .json({ success: false, reason: logMessage } as APICreateGoalReturn);
    }
  } catch (err) {
    const logMessage = `Data Received: ${JSON.stringify(
      data
    )}\n\t ... FAILURE:  Body of POST to ${API_CREATE_GOAL_ENDPOINT} is not in correct format: ${err}`;

    res
      .status(400)
      .json({ success: false, reason: logMessage } as APICreateGoalReturn);
  }
});

router.get(API_READ_GOAL_ENDPOINT, async (req: Request, res: Response) => {
  const params = req.query;

  // try to unwrap data into APICreateGoalArguments type
  try {
    const readData: APIReadGoalArguments =
      await apiReadGoalArgumentsSchema.validate(req.query);

    // user_id and resolution_key help us path the read request
    const user_id = readData.user_id;
    const resolution_key = readData.resolution_key;

    const resolutionExists = await doesResolutionExist(user_id, resolution_key);
    if (resolutionExists.exists === false) {
      throw resolutionExists.error;
    }

    // get a reference to the goals for the user's Resolution
    const userGoalsRef = ref(
      database,
      RTDB_RESOLUTIONS_PATH + user_id + "/" + resolution_key + "/goals"
    );

    // get a snapshot of the goals currently at userGoalsRef
    try {
      const goalsSnapshot = await get(userGoalsRef);

      res.status(200).json({
        success: true,
        goals: goalsSnapshot.val() ?? {}, // there may not be any goals, so null coalesce to empty object
      } as APIReadGoalReturn);
    } catch (err) {
      const logMessage = `FAILURE: Call to ${API_READ_GOAL_ENDPOINT} was unsuccessful: ${err}`;

      res
        .status(500)
        .json({ success: false, reason: logMessage } as APIReadGoalReturn);
    }
  } catch (err) {
    const logMessage = `Query Paramgs Received: ${JSON.stringify(
      params
    )}\n\t ... FAILURE: Query params of GET to ${API_READ_GOAL_ENDPOINT} is not in correct format: ${err}`;

    res.status(400).json({ success: false, reason: logMessage });
  }
});

router.post(
  API_COMPLETE_GOAL_ENDPOINT,
  async (req: Request, res: Response) => {}
);

router.post(
  API_UPDATE_GOAL_DESCRIPTION_ENDPOINT,
  async (req: Request, res: Response) => {}
);

// router.post(
//   API_DELETE_GOAL_ENDPOINT,
//   async (req: Request, res: Response) => {}
// );

export default router;
