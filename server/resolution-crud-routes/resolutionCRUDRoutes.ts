import { Router, Request, Response } from "express";
import { ref, push, set } from "firebase/database";

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
    const createData: APICreateResolutionArguments =
      apiCreateResolutionArgumentsSchema.cast(data);

    // add data to the database
    const user_id = createData.user_id;

    const dataToAdd: Resolution = {
      title: createData.title,
      description: createData.description,
    };

    const userResolutionsRef = ref(database, RTDB_RESOLUTIONS_PATH + user_id);
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

export default router;
