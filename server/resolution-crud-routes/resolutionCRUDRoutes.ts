import { Router, Request, Response } from "express";
import { ref, push, set, get, child, update, remove } from "firebase/database";

import {
  API_CREATE_RESOLUTION_ENDPOINT,
  API_DELETE_RESOLUTION_ENDPOINT,
  API_READ_RESOLUTION_ENDPOINT,
  API_UPDATE_RESOLUTION_ENDPOINT,
} from "../constants/apiEndpoints";
import {
  Resolution,
  APICreateResolutionArguments,
  apiCreateResolutionArgumentsSchema,
  APICreateResolutionReturn,
  APIReadResolutionArguments,
  apiReadResolutionArgumentsSchema,
  APIReadResolutionReturn,
  APIUpdateResolutionArguments,
  apiUpdateResolutionArgumentsSchema,
  APIDeleteResolutionArguments,
  apiDeleteResolutionArgumentsSchema,
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
      const createData: APICreateResolutionArguments =
        apiCreateResolutionArgumentsSchema.cast(data);

      // MARK: cast is used instead of validate
      // - cast will just make sure that the defined schema fields exist, and throw away any extra
      //     fields
      // - whereas validate will raise an error if extra fields exist
      // for now, I've decided we won't care if extra data is sent, as long as the required data
      //   is there

      const user_id = createData.user_id;

      // create the object to add to the database
      const dataToAdd: Resolution = {
        title: createData.title,
        description: createData.description,
      };

      // get reference to the database at the specified path
      const userResolutionsRef = ref(database, RTDB_RESOLUTIONS_PATH + user_id);

      // we use push to basically append to a list
      const newResolutionRef = push(userResolutionsRef);

      try {
        await set(newResolutionRef, dataToAdd);

        console.log(
          `Data Received: ${JSON.stringify(
            createData
          )}\n\t ... SUCCESS: ${JSON.stringify(
            dataToAdd
          )} added to the RTDB at ${RTDB_RESOLUTIONS_PATH + user_id}`
        );

        res.json({ success: true } as APICreateResolutionReturn);
      } catch (err) {
        console.log(
          `Data Received: ${JSON.stringify(
            createData
          )}\n\t ... FAILURE: data could not be added to the DB: ${err}`
        );

        res.json({ success: false, reason: err } as APICreateResolutionReturn);
      }
    } catch (err) {
      console.log(
        `Data Received: ${JSON.stringify(
          data
        )}\n\t ... FAILURE: Body of POST to ${API_CREATE_RESOLUTION_ENDPOINT} is not in correct format: ${err}`
      );

      res.json({
        success: false,
        reason: `Data Received: ${JSON.stringify(
          data
        )}\n\t ... FAILURE: Body of POST to ${API_CREATE_RESOLUTION_ENDPOINT} is not in correct format: ${err}`,
      });
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
        apiReadResolutionArgumentsSchema.cast(req.query);

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
          res.json({
            success: false,
            reason: `FAILURE: No data available at ${
              RTDB_RESOLUTIONS_PATH + user_id
            }`,
          } as APIReadResolutionReturn);

          return;
        }

        res.json({
          success: true,
          resolutions: snapshot.val(),
        } as APIReadResolutionReturn);
      } catch (err) {
        console.log(err);

        res.json({
          success: false,
          reason: `FAILURE: Call to /api/read-resolution was unsuccessful: ${err}`,
        } as APIReadResolutionReturn);
      }
    } catch (err) {
      console.log(
        `Queury Params Received: ${JSON.stringify(
          params
        )}\n\t ... FAILURE: Body of GET to ${API_READ_RESOLUTION_ENDPOINT} is not in correct format: ${err}`
      );

      res.json({
        success: false,
        reason: `Data Received: ${JSON.stringify(
          params
        )}\n\t ... FAILURE: Body of GET to ${API_READ_RESOLUTION_ENDPOINT} is not in correct format: ${err}`,
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
        apiUpdateResolutionArgumentsSchema.cast(data);

      // get the parameters for the path to update on
      // this will be resolution/user_id/firebase_key
      const user_id = updateData.user_id;
      const firebase_key = updateData.firebase_key;

      // create new object for the actual update to make
      const dataToUpdate: Resolution = {
        title: updateData.new_title,
        description: updateData.new_description,
      };

      // get a reference to the database
      const databaseRef = ref(database);

      // NOTE: you can simultaneously push multiple updates just by adding another field to
      //   the updates object
      const updates: any = {};
      updates[`${RTDB_RESOLUTIONS_PATH}${user_id}/${firebase_key}`] =
        dataToUpdate;

      // make the update
      try {
        await update(databaseRef, updates);

        res.send(
          `Data Received: ${JSON.stringify(
            updateData
          )}\n\t ... ${JSON.stringify(dataToUpdate)} updated to the RTDB at ${
            RTDB_RESOLUTIONS_PATH + user_id
          }/${firebase_key}`
        );
      } catch (err) {
        console.log(err);

        res.send(
          `Data Received: ${JSON.stringify(
            updateData
          )}\n\t ... update could not be made to the DB: ${err}`
        );
      }
    } catch (err) {
      console.log(err);
      res.send(
        `Body of POST to ${API_UPDATE_RESOLUTION_ENDPOINT} is not in correct format: ${err}`
      );
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

        res.send(
          `Data Received: ${JSON.stringify(
            deleteData
          )}\n\t ... data at ${deletePath} successfully deleted`
        );
      } catch (err) {
        console.log(err);

        res.send(
          `Data Received: ${JSON.stringify(
            deleteData
          )}\n\t ... delete could not be made on the DB: ${err}`
        );
      }
    } catch (err) {
      console.log(err);
      res.send(
        `Body of POST to ${API_DELETE_RESOLUTION_ENDPOINT} is not in correct format: ${err}`
      );
    }
  }
);

export default router;
