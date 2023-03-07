import request from "supertest";

import app from "../app";
import {
  API_COMPLETE_GOAL_ENDPOINT,
  API_CREATE_GOAL_ENDPOINT,
  API_READ_GOAL_ENDPOINT,
} from "../constants/apiEndpoints";
import {
  APICompleteGoalArguments,
  APICreateGoalArguments,
  Goal,
  Resolution,
} from "../constants/apiInterfaces";

import { RTDB_RESOLUTIONS_PATH } from "../constants/firebaseRTDBPaths";
import { database } from "../utils/firebase";
import { ref, set, get, remove } from "@firebase/database";

describe("Test Goal CRUD API", () => {
  const test_user_id = "test_user_goal_crud";
  const test_resolution_key = "test_key_goal_crud";

  const test_goal_description_1 = "Win more. Lose less.";
  //   const test_goal_updated_description_1 = "Only win. Do not lose.";

  const test_goal_key_1 = "goal_uno";
  const test_goal_key_2 = "goal_dos";

  const test_goal_description_2 = "Test goal description 2";
  //   const test_goal_updated_description_2 = "Test goal updated description 2";

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

  const createSampleGoals = async () => {
    // create sample goals for the test user for their test resolution
    const test_user_resolution_path =
      RTDB_RESOLUTIONS_PATH + test_user_id + "/" + test_resolution_key;
    const test_resolution_goals_path = test_user_resolution_path + "/goals";
    const test_resolution_goals_ref = ref(database, test_resolution_goals_path);

    const goal1: Goal = {
      description: test_goal_description_1,
      complete: false,
    };

    const goal2: Goal = {
      description: test_goal_description_2,
      complete: false,
    };

    // use determinstic keys for the goals
    await set(test_resolution_goals_ref, {
      [test_goal_key_1]: goal1,
      [test_goal_key_2]: goal2,
    });
  };

  describe(`POST ${API_CREATE_GOAL_ENDPOINT}`, () => {
    describe("Proper Functionality", () => {
      let res: any;

      beforeAll(async () => {
        // Arrange
        const postBody: APICreateGoalArguments = {
          user_id: test_user_id,
          resolution_key: test_resolution_key,
          description: test_goal_description_1,
        };

        // Act
        // create a goal for test_user_id's Resolution that has the key testResolutionKey
        res = await request(app).post(API_CREATE_GOAL_ENDPOINT).send(postBody);
      });

      // Assert
      it("Should return an HTTP Response Status of 200", () => {
        expect(res.statusCode).toEqual(200);
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
        expect(goal["description"]).toEqual(test_goal_description_1);
        expect(goal["complete"]).toEqual(false);
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

  describe(`GET ${API_READ_GOAL_ENDPOINT}`, () => {
    beforeAll(async () => {
      // Arrange
      await createSampleGoals();
    });

    describe("Proper Functionality", () => {
      let res: any, resBody: any;

      beforeAll(async () => {
        // Act
        res = await request(app).get(API_READ_GOAL_ENDPOINT).query({
          user_id: test_user_id,
          resolution_key: test_resolution_key,
        });
        resBody = JSON.parse(res.text);
      });

      it("Should return an HTTP Response Status of 200", () => {
        expect(res.statusCode).toEqual(200);
      });

      it(`Should return the goals (count is 2) for user_id=${test_user_id} and resolution_key=${test_resolution_key}`, () => {
        expect(Object.keys(resBody["goals"]).length).toEqual(2);
      });
    });

    describe("Erroneous Usage", () => {
      describe("Invalid format for query parameters", () => {
        let res: any, resBody: any;

        beforeAll(async () => {
          // do not provide the necessary query parameters
          res = await request(app).get(`${API_READ_GOAL_ENDPOINT}`);
          resBody = JSON.parse(res.text);
        });

        it("Should return an HTTP Response Status of 400", async () => {
          expect(res.statusCode).toEqual(400);
        });

        it("Should indicate failure", async () => {
          expect(resBody["success"]).toEqual(false);
        });

        it("Should have a defined failure reason", async () => {
          expect(resBody["reason"]).toBeDefined;
        });
      });

      describe("Non-existent User", () => {
        let res: any, resBody: any;

        beforeAll(async () => {
          // Act
          // POST with a non-existent user
          res = await request(app).get(API_READ_GOAL_ENDPOINT).query({
            user_id: "non_existent_user",
            resolution_key: test_resolution_key,
          });
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

        beforeAll(async () => {
          // Act
          // POST with a non-existent user
          res = await request(app).get(API_READ_GOAL_ENDPOINT).query({
            user_id: test_user_id,
            resolution_key: "non_existent_resolution",
          });
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

  describe(`POST ${API_COMPLETE_GOAL_ENDPOINT}`, () => {
    describe("Proper Functionality", () => {
      let res: any;
      beforeAll(async () => {
        // Arrange
        await createSampleGoals();

        const completeBody: APICompleteGoalArguments = {
          user_id: test_user_id,
          resolution_key: test_resolution_key,
          goal_key: test_goal_key_1,
          complete: true,
        };

        // Act
        // update the goal "complete" field with the complete argument
        res = await request(app)
          .post(API_COMPLETE_GOAL_ENDPOINT)
          .send(completeBody);
      });

      // Assert
      it("Should return an HTTP Response Status of 200", () => {
        expect(res.statusCode).toEqual(200);
      });

      it("Should have changed the goal's complete field to true", async () => {
        const goalRef = ref(
          database,
          RTDB_RESOLUTIONS_PATH +
            test_user_id +
            "/" +
            test_resolution_key +
            "/goals/" +
            test_goal_key_1
        );

        const goal: Goal = (await get(goalRef)).val();
        expect(goal.complete).toEqual(true);
      });
    });

    describe("Erroneous Usage", () => {
      describe("Invalid format of POST body", () => {
        let res: any, resBody: any;
        beforeAll(async () => {
          // Arrange
          const badPostBody: APICompleteGoalArguments = {
            user_id: test_user_id,
            resolution_key: test_resolution_key,
            goal_key: "",
            complete: false,
          };

          // Act
          // POST with a bad body format
          res = await request(app)
            .post(API_COMPLETE_GOAL_ENDPOINT)
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
          const badPostBody: APICompleteGoalArguments = {
            user_id: "non_existent_user",
            resolution_key: test_resolution_key,
            goal_key: test_goal_key_1,
            complete: true,
          };

          // Act
          // POST with a non-existent user
          res = await request(app)
            .post(API_COMPLETE_GOAL_ENDPOINT)
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
          const badPostBody: APICompleteGoalArguments = {
            user_id: test_user_id,
            resolution_key: "non_existent_resolution",
            goal_key: test_goal_key_1,
            complete: true,
          };

          // Act
          // POST with a non-existent user
          res = await request(app)
            .post(API_COMPLETE_GOAL_ENDPOINT)
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
    describe("Non-existent Goal", () => {
      let res: any, resBody: any;

      // Arrange
      beforeAll(async () => {
        const badPostBody: APICompleteGoalArguments = {
          user_id: test_user_id,
          resolution_key: test_resolution_key,
          goal_key: "non_existent_goal",
          complete: true,
        };

        // Act
        // POST with a non-existent user
        res = await request(app)
          .post(API_COMPLETE_GOAL_ENDPOINT)
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
