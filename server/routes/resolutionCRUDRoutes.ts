import { Router, Request, Response } from "express";
import { ref, push, set, get, child, update, remove } from "firebase/database";

import {
  API_CREATE_RESOLUTION_ENDPOINT,
  API_DELETE_RESOLUTION_ENDPOINT,
  API_READ_RESOLUTION_ENDPOINT,
  API_UPDATE_RESOLUTION_ENDPOINT,
} from "../constants/apiEndpoints";
import {
  // Resolution CRUD
  Resolution,
  APICreateResolutionArguments,
  apiCreateResolutionArgumentsSchema,
  APICreateResolutionReturn,
  APIReadResolutionArguments,
  apiReadResolutionArgumentsSchema,
  APIReadResolutionReturn,
  APIUpdateResolutionArguments,
  apiUpdateResolutionArgumentsSchema,
  APIUpdateResolutionReturn,
  APIDeleteResolutionArguments,
  apiDeleteResolutionArgumentsSchema,
  APIDeleteResolutionReturn,

  // Goal-related
  Goal,
} from "../constants/apiInterfaces";
import { RTDB_RESOLUTIONS_PATH } from "../constants/firebaseRTDBPaths";

import { database } from "../utils/firebase";

const router: Router = Router();

router.post(
  API_CREATE_RESOLUTION_ENDPOINT,
  async (req: Request, res: Response) => {
    const data = req.body;

    // try to unwrap data into APICreateResolutionArguments type
    try {
      // use yup ObjectSchema cast method to validate the request arguments
      // use validate to ensure that title is a required field
      const createData: APICreateResolutionArguments =
        await apiCreateResolutionArgumentsSchema.validate(data);

      const user_id = createData.user_id;

      // create the object to add to the database
      const dataToAdd: Resolution = {
        title: createData.title,
        description: createData.description,
        goals: {}, // we will push an actual object later, TypeScript mandates we put this here
      };

      // get reference to the database at the specified path
      const userResolutionsRef = ref(database, RTDB_RESOLUTIONS_PATH + user_id);

      // we use push to basically append to a list
      const newResolutionRef = await push(userResolutionsRef);

      try {
        await set(newResolutionRef, dataToAdd);

        // now add a sample goal to the resolution
        const goalToAdd: Goal = {
          description: "Your goal here!",
          nTimesToAchieve: 1,
          completed: false,
        };

        // get the key of the newly created resolution
        const newResolutionKey = newResolutionRef.key;

        // get reference to the database at the specified path
        const newResolutionGoalsRef = ref(
          database,
          RTDB_RESOLUTIONS_PATH + user_id + "/" + newResolutionKey + "/goals"
        );

        // push a new goal to the resolution
        const newGoalRef = await push(newResolutionGoalsRef);

        try {
          await set(newGoalRef, goalToAdd);

          // @ts-ignore
          const logMessage = `Data Received: ${JSON.stringify(
            createData
          )}\n\t ... SUCCESS: ${JSON.stringify(
            dataToAdd
          )} added to the RTDB at ${RTDB_RESOLUTIONS_PATH + user_id}`;

          // console.log(logMessage);

          res.status(200).json({ success: true } as APICreateResolutionReturn);
        } catch (err) {
          // just throw the error to the catch block below
          throw err;
        }
      } catch (err) {
        const logMessage = `Data Received: ${JSON.stringify(
          createData
        )}\n\t ... FAILURE: data could not be added to the DB: ${err}`;

        // console.log(logMessage);

        res.status(500).json({
          success: false,
          reason: logMessage,
        } as APICreateResolutionReturn);
      }
    } catch (err) {
      const logMessage = `Data Received: ${JSON.stringify(
        data
      )}\n\t ... FAILURE: Body of POST to ${API_CREATE_RESOLUTION_ENDPOINT} is not in correct format: ${err}`;

      // console.log(logMessage);

      res.status(400).json({
        success: false,
        reason: logMessage,
      } as APICreateResolutionReturn);
    }
  }
);

router.get(
  API_READ_RESOLUTION_ENDPOINT,
  async (req: Request, res: Response) => {
    const params = req.query;
    // NOTE: consider looking at using onValue and returning some listener -- perhaps on the client side

    // try to unwrap query params into APIReadResolutionArguments type
    try {
      const readData: APIReadResolutionArguments =
        await apiReadResolutionArgumentsSchema.validate(req.query);

      // user_id will help us path the read request
      const user_id = readData.user_id;

      // get a reference to the database
      const databaseRef = ref(database);

      // get a snapshot of the data currently at the ref and path
      try {
        const snapshot = await get(
          child(databaseRef, RTDB_RESOLUTIONS_PATH + user_id)
        );

        // data may not be available at path
        if (!snapshot.exists()) {
          const logMessage = `FAILURE: No data available at ${
            RTDB_RESOLUTIONS_PATH + user_id
          }`;

          res.status(404).json({
            success: false,
            reason: logMessage,
          } as APIReadResolutionReturn);

          return;
        }

        res.status(200).json({
          success: true,
          resolutions: snapshot.val(),
        } as APIReadResolutionReturn);
      } catch (err) {
        const logMessage = `FAILURE: Call to /api/read-resolution was unsuccessful: ${err}`;

        // console.log(logMessage);

        res.status(500).json({
          success: false,
          reason: logMessage,
        } as APIReadResolutionReturn);
      }
    } catch (err) {
      const logMessage = `Queury Params Received: ${JSON.stringify(
        params
      )}\n\t ... FAILURE: Query Parameters of GET to ${API_READ_RESOLUTION_ENDPOINT} is not in correct format: ${err}`;

      // console.log(logMessage);

      res.status(400).json({
        success: false,
        reason: logMessage,
      });
    }
  }
);

router.post(
  API_UPDATE_RESOLUTION_ENDPOINT,
  async (req: Request, res: Response) => {
    const data = req.body;

    // try to unwrap data into APIUpdateResolutionArguments type
    try {
      // use yup ObjectSchema cast method to validate the request arguments
      const updateData: APIUpdateResolutionArguments =
        await apiUpdateResolutionArgumentsSchema.validate(data);

      // get the parameters for the path to update on
      // this will be resolution/user_id/firebase_key
      const user_id = updateData.user_id;
      const firebase_key = updateData.firebase_key;

      const new_title = updateData.new_title;
      const new_description = updateData.new_description;

      // get paths for title and description on the Resolution
      const titlePath = `${RTDB_RESOLUTIONS_PATH}${user_id}/${firebase_key}/title`;
      const descriptionPath = `${RTDB_RESOLUTIONS_PATH}${user_id}/${firebase_key}/description`;

      // get a reference to the database
      const databaseRef = ref(database);

      // NOTE: you can simultaneously push multiple updates just by adding another field to
      //   the updates object
      const updates: any = {};
      updates[titlePath] = new_title;
      updates[descriptionPath] = new_description;

      // make the update
      try {
        await update(databaseRef, updates);

        res.status(200).json({ success: true } as APIUpdateResolutionReturn);
      } catch (err) {
        const logMessage = `Data Received: ${JSON.stringify(
          updateData
        )}\n\t ... FAILURE: update could not be made to the DB: ${err}`;

        res.status(500).json({
          success: false,
          reason: logMessage,
        } as APIUpdateResolutionReturn);
      }
    } catch (err) {
      const logMessage = `Data Received: ${JSON.stringify(
        data
      )}\n\t ... FAILURE: Body of POST to ${API_UPDATE_RESOLUTION_ENDPOINT} is not in correct format: ${err}`;

      res.status(400).json({
        success: false,
        reason: logMessage,
      } as APIUpdateResolutionReturn);
    }
  }
);

router.post(
  API_DELETE_RESOLUTION_ENDPOINT,
  async (req: Request, res: Response) => {
    const data = req.body;

    // try to unwrap data into APIDeleteResolutionArguments type
    try {
      // use yup ObjectSchema cast method to validate the request arguments
      const deleteData: APIDeleteResolutionArguments =
        await apiDeleteResolutionArgumentsSchema.validate(data, {
          strict: true,
        });
      // MARK: validate is used instead of cast since we want to strictly disallow empty strings
      //   to be provided for either field in APIDeleteResolutionArguments

      // get the parameters for the path to delete on
      // this will be resolution/user_id/firebase_key
      const deletePath =
        RTDB_RESOLUTIONS_PATH +
        deleteData.user_id +
        "/" +
        deleteData.firebase_key;

      // get a reference to the database on the path resolution/user_id/firebase_key
      const deleteRef = ref(database, deletePath);

      // delete the object at the path
      try {
        await remove(deleteRef);

        // @ts-ignore
        const logMessage = `Data Received: ${JSON.stringify(
          deleteData
        )}\n\t ... data at ${deletePath} successfully deleted`;

        // console.log(logMessage);

        res.status(200).json({ success: true } as APIDeleteResolutionReturn);
      } catch (err) {
        const logMessage = `Data Received: ${JSON.stringify(
          deleteData
        )}\n\t ... delete could not be made on the DB: ${err}`;

        // console.log(logMessage);

        res.status(500).json({
          success: false,
          reason: logMessage,
        } as APIDeleteResolutionReturn);
      }
    } catch (err) {
      const logMessage = `Data Received: ${JSON.stringify(
        data
      )}\n\t ... FAILURE: Body of POST to ${API_DELETE_RESOLUTION_ENDPOINT} is not in correct format: ${err}`;

      // console.log(logMessage);

      res.status(400).json({
        success: false,
        reason: logMessage,
      } as APIDeleteResolutionReturn);
    }
  }
);

export default router;
