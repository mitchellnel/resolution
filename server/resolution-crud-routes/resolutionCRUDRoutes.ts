import { Router, Request, Response } from "express";
import { ref, push, set, get, child } from "firebase/database";

import { API_CREATE_RESOLUTION_ENDPOINT } from "../constants/apiEndpoints";
import {
  Resolution,
  APICreateResolutionArguments,
  apiCreateResolutionArgumentsSchema,
} from "../constants/apiInterfaces";
import { RTDB_RESOLUTIONS_PATH } from "../constants/firebaseRTDBPaths";

import { database } from "../utils/firebase";

const router: Router = Router();

router.post("/api/create-resolution", async (req: Request, res: Response) => {
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

      res.send(
        `Data Received: ${JSON.stringify(createData)}\n\t ... ${JSON.stringify(
          dataToAdd
        )} added to the RTDB at ${RTDB_RESOLUTIONS_PATH + user_id}`
      );
    } catch (err) {
      console.log(err);

      res.send(
        `Data Received: ${JSON.stringify(
          createData
        )}\n\t ... data could not be added to the DB: ${err}`
      );
    }
  } catch (err) {
    console.log(err);
    res.send(
      `Body of POST to ${API_CREATE_RESOLUTION_ENDPOINT} is not in correct format: ${err}`
    );
  }
});

router.get("/api/read-resolution", async (req: Request, res: Response) => {
  // NOTE: consider looking at using onValue and returning some listener -- perhaps on the client side

  // use query parameters to find out what DB path (user_id) to read from
  // reject request if user_id not included
  if (req.query.user_id === undefined) {
    res.send("No path parameter sent");
    return;
  }

  const user_id = req.query.user_id as string;

  // get a reference to the database
  const databaseRef = ref(database);

  // get a snapshot of the data currently at the ref and path
  try {
    const snapshot = await get(
      child(databaseRef, RTDB_RESOLUTIONS_PATH + user_id)
    );

    // data may not be available at path
    if (!snapshot.exists()) {
      res.send(`No data available at ${RTDB_RESOLUTIONS_PATH + user_id}`);
      return;
    }

    res.send(snapshot.val());
  } catch (err) {
    console.log(err);

    res.send(`Call to /api/read-resolution was unsuccessful: ${err}`);
  }
});

export default router;
