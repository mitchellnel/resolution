import { ref, set, get, remove } from "@firebase/database";
import { API_CREATE_GOAL_ENDPOINT } from "../constants/apiEndpoints";
import {
  APICreateGoalArguments,
  // @ts-ignore
  Goal,
  Resolution,
} from "../constants/apiInterfaces";
import { RTDB_RESOLUTIONS_PATH } from "../constants/firebaseRTDBPaths";
import request from "supertest";
import { database } from "../utils/firebase";

import app from "../app";

describe("Test Goal CRUD API", () => {
  const test_user_id = "test_user_goal_crud";
  const test_resolution_key = "test_key_goal_crud";

  const test_goal_description = "Win more. Lose less.";
  //   const test_goal_updated_description = "Only win. Do not lose.";

  beforeAll(async () => {
    // create a Resolution to add goals to
    const test_user_id_path = RTDB_RESOLUTIONS_PATH + test_user_id;
    const test_user_id_db_ref = ref(database, test_user_id_path);

    const newResolution: Resolution = {
      title: "Test Resolution",
      description: "Test Description",
      goals: {},
    };

    // don't use push -- easier to keep the key for the Resolution constant by doing this
    await set(test_user_id_db_ref, { [test_resolution_key]: newResolution });
  });

  afterAll(async () => {
    // delete the Resolution we made for testing
    const test_user_id_path = RTDB_RESOLUTIONS_PATH + test_user_id;
    const test_user_id_db_ref = ref(database, test_user_id_path);

    await remove(test_user_id_db_ref);
  });

  describe(`POST ${API_CREATE_GOAL_ENDPOINT}`, () => {
    describe("Proper Functionality", () => {
      let res: any;

      beforeAll(async () => {
        // Arrange
        const postBody: APICreateGoalArguments = {
          user_id: test_user_id,
          resolution_key: test_resolution_key,
          description: test_goal_description,
        };

        // Act
        // create a goal for test_user_id's Resolution that has the key testResolutionKey
        res = await request(app).post(API_CREATE_GOAL_ENDPOINT).send(postBody);
      });

      // Assert
      it("Should return an HTTP Response Status of 200", () => {
        expect(res.statusCode).toBe(200);
      });

      it("Should have correctly created the Goal for the Test Resolution", async () => {
        const resolutionRef = ref(
          database,
          RTDB_RESOLUTIONS_PATH + test_user_id + "/" + test_resolution_key
        );

        const resolution: Resolution = (await get(resolutionRef)).val();
        expect(resolution).toBeDefined();

        const resolutionGoals = resolution["goals"];
        const goal: Goal = resolutionGoals[Object.keys(resolutionGoals)[0]]!;
        expect(goal["description"]).toBe(test_goal_description);
        expect(goal["complete"]).toBe(false);
      });
    });

    describe("Erroneous Usage", () => {
      describe("Invalid format of POST body", () => {
        let res: any, resBody: any;
        beforeAll(async () => {
          // Arrange
          const badPostBody: APICreateGoalArguments = {
            user_id: test_user_id,
            resolution_key: test_resolution_key,
            description: "",
          };

          // Act
          // POST with a bad body format
          res = await request(app)
            .post(API_CREATE_GOAL_ENDPOINT)
            .send(badPostBody);
          resBody = JSON.parse(res.text);
        });

        // Assert
        it("Should return an HTTP Response Status of 400", () => {
          expect(res.statusCode).toEqual(400);
        });

        it("Should indicate failure", () => {
          expect(resBody["success"]).toEqual(false);
        });

        it("Should have a defined failure reason", () => {
          expect(resBody["reason"]).toBeDefined();
        });
      });

      describe("Non-existent User", () => {
        let res: any, resBody: any;

        // Arrange
        beforeAll(async () => {
          const badPostBody: APICreateGoalArguments = {
            user_id: "non_existent_user",
            resolution_key: test_resolution_key,
            description: test_goal_description_1,
          };

          // Act
          // POST with a non-existent user
          res = await request(app)
            .post(API_CREATE_GOAL_ENDPOINT)
            .send(badPostBody);
          resBody = JSON.parse(res.text);
        });

        // Assert
        it("Should return an HTTP Response Status of 400", () => {
          expect(res.statusCode).toEqual(400);
        });

        it("Should indicate failure", () => {
          expect(resBody["success"]).toEqual(false);
        });

        it("Should have a defined failure reason", () => {
          expect(resBody["reason"]).toBeDefined();
        });
      });

      describe("Non-existent Resolution", () => {
        let res: any, resBody: any;

        // Arrange
        beforeAll(async () => {
          const badPostBody: APICreateGoalArguments = {
            user_id: test_user_id,
            resolution_key: "non_existent_resolution",
            description: test_goal_description_1,
          };

          // Act
          // POST with a non-existent user
          res = await request(app)
            .post(API_CREATE_GOAL_ENDPOINT)
            .send(badPostBody);
          resBody = JSON.parse(res.text);
        });

        // Assert
        it("Should return an HTTP Response Status of 400", () => {
          expect(res.statusCode).toEqual(400);
        });

        it("Should indicate failure", () => {
          expect(resBody["success"]).toEqual(false);
        });

        it("Should have a defined failure reason", () => {
          expect(resBody["reason"]).toBeDefined();
        });
      });
    });
  });
});
