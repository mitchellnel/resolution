import request from "supertest";

import app from "../app";
import {
  API_ACHIEVE_GOAL_ENDPOINT,
  API_ASSIGN_EVENT_TO_GOAL_ENDPOINT,
  API_COMPLETE_GOAL_ENDPOINT,
  API_CREATE_GOAL_ENDPOINT,
  API_DELETE_GOAL_ENDPOINT,
  API_READ_GOAL_ENDPOINT,
  API_UPDATE_GOAL_DESCRIPTION_ENDPOINT,
} from "../constants/apiEndpoints";
import {
  APIAchieveGoalArguments,
  APIAssignEventToGoalArguments,
  APICompleteGoalArguments,
  APICreateGoalArguments,
  APIDeleteGoalArguments,
  APIUpdateGoalDescriptionArguments,
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
  const test_goal_updated_description_1 = "Only win. Do not lose.";

  const test_goal_key_1 = "goal_uno";
  const test_goal_key_2 = "goal_dos";

  const test_goal_description_2 = "Test goal description 2";

  const test_goal_nTimesToAchieve_1 = 1;
  const test_goal_nTimesToAchieve_2 = 3;

  const test_event_id_1 = "test_event_id_1";

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
      nTimesToAchieve: test_goal_nTimesToAchieve_1,
      completed: false,
    };

    const goal2: Goal = {
      description: test_goal_description_2,
      nTimesToAchieve: test_goal_nTimesToAchieve_2,
      completed: false,
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
          nTimesToAchieve: test_goal_nTimesToAchieve_1,
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
        expect(goal.description).toEqual(test_goal_description_1);
        expect(goal.nTimesToAchieve).toEqual(test_goal_nTimesToAchieve_1);
        expect(goal.completed).toEqual(false);
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
            nTimesToAchieve: test_goal_nTimesToAchieve_1,
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
            nTimesToAchieve: test_goal_nTimesToAchieve_1,
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
            nTimesToAchieve: test_goal_nTimesToAchieve_1,
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

  describe(`POST ${API_ASSIGN_EVENT_TO_GOAL_ENDPOINT}`, () => {
    beforeAll(async () => {
      // Arrange
      await createSampleGoals();
    });

    describe("Proper Functionality", () => {
      let res: any;

      beforeAll(async () => {
        const postBody: APIAssignEventToGoalArguments = {
          user_id: test_user_id,
          resolution_key: test_resolution_key,
          goal_key: test_goal_key_1,
          event_id: test_event_id_1,
        };

        // Act
        res = await request(app)
          .post(API_ASSIGN_EVENT_TO_GOAL_ENDPOINT)
          .send(postBody);
      });

      it("Should return an HTTP Response Status of 200", () => {
        expect(res.statusCode).toEqual(200);
      });

      it("Should have correctly set the eventID field on the Goal", async () => {
        const eventIDRef = ref(
          database,
          RTDB_RESOLUTIONS_PATH +
            test_user_id +
            "/" +
            test_resolution_key +
            "/goals/" +
            test_goal_key_1 +
            "/eventID"
        );

        const eventID: string = (await get(eventIDRef)).val();
        expect(eventID).toEqual(test_event_id_1);
      });
    });

    describe("Erroneous Usage", () => {
      describe("Invalid format for request body", () => {
        let res: any, resBody: any;

        beforeAll(async () => {
          // do not provide the necessary query parameters
          res = await request(app).post(API_ASSIGN_EVENT_TO_GOAL_ENDPOINT);
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
          const badPostBody: APIAssignEventToGoalArguments = {
            user_id: "non_existent_user",
            resolution_key: test_resolution_key,
            goal_key: test_goal_key_1,
            event_id: test_event_id_1,
          };

          // Act
          // POST with a non-existent user
          res = await request(app)
            .post(API_ASSIGN_EVENT_TO_GOAL_ENDPOINT)
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

        beforeAll(async () => {
          const badPostBody: APIAssignEventToGoalArguments = {
            user_id: test_user_id,
            resolution_key: "non_existent_resolution",
            goal_key: test_goal_key_1,
            event_id: test_event_id_1,
          };

          // Act
          // POST with a non-existent user
          res = await request(app)
            .post(API_ASSIGN_EVENT_TO_GOAL_ENDPOINT)
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

      describe("Non-existent Goal", () => {
        let res: any, resBody: any;

        beforeAll(async () => {
          const badPostBody: APIAssignEventToGoalArguments = {
            user_id: test_user_id,
            resolution_key: test_resolution_key,
            goal_key: "non_existent_goal",
            event_id: test_event_id_1,
          };

          // Act
          // POST with a non-existent user
          res = await request(app)
            .post(API_ASSIGN_EVENT_TO_GOAL_ENDPOINT)
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

  describe(`POST ${API_ACHIEVE_GOAL_ENDPOINT}`, () => {
    describe("Proper Functionality", () => {
      let res: any;
      beforeAll(async () => {
        // Arrange
        await createSampleGoals();

        const achieveBody: APIAchieveGoalArguments = {
          user_id: test_user_id,
          resolution_key: test_resolution_key,
          goal_key: test_goal_key_2,
        };

        // Act
        // decrement the goal's nTimesToAchieve by 1 by calling /api/achieve-goal
        res = await request(app)
          .post(API_ACHIEVE_GOAL_ENDPOINT)
          .send(achieveBody);
      });

      // Assert
      it("Should return an HTTP Response Status of 200", () => {
        expect(res.statusCode).toEqual(200);
      });

      it("Should have decremented nTimesToAchieve by 1", async () => {
        const goalPath =
          RTDB_RESOLUTIONS_PATH +
          test_user_id +
          "/" +
          test_resolution_key +
          "/goals/" +
          test_goal_key_2;
        const goalRef = ref(database, goalPath);

        const goal = (await get(goalRef)).val();
        expect(goal.nTimesToAchieve).toEqual(test_goal_nTimesToAchieve_2 - 1);
      });
    });

    describe("Erroneous Usage", () => {
      describe("nTimesToAchieve is 1", () => {
        let res: any, resBody: any;

        beforeAll(async () => {
          // Arrange
          await createSampleGoals();

          const achieveBody: APIAchieveGoalArguments = {
            user_id: test_user_id,
            resolution_key: test_resolution_key,
            goal_key: test_goal_key_1,
          };

          // Act
          // try todecrement the goal's nTimesToAchieve by 1 by calling /api/achieve-goal
          res = await request(app)
            .post(API_ACHIEVE_GOAL_ENDPOINT)
            .send(achieveBody);
          resBody = JSON.parse(res.text);
        });

        // Assert
        it("Should return an HTTP Response Status of 400", () => {
          expect(res.statusCode).toEqual(400);
        });

        it("Should indicate failure", () => {
          expect(resBody["success"]).toEqual(false);
        });

        it(`Should tell the caller to call ${API_COMPLETE_GOAL_ENDPOINT} instead`, () => {
          expect(resBody["reason"]).toEqual(
            `nTimesToAchieve is 1 -- call ${API_COMPLETE_GOAL_ENDPOINT} instead`
          );
        });
      });

      describe("Invalid format for body", () => {
        let res: any, resBody: any;

        beforeAll(async () => {
          // do not provide the necessary body parameters
          res = await request(app).post(API_ACHIEVE_GOAL_ENDPOINT);
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

        // Arrange
        beforeAll(async () => {
          const badPostBody: APIAchieveGoalArguments = {
            user_id: "non_existent_user",
            resolution_key: test_resolution_key,
            goal_key: test_goal_key_1,
          };

          // Act
          // POST with a non-existent user
          res = await request(app)
            .post(API_ACHIEVE_GOAL_ENDPOINT)
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

        beforeAll(async () => {
          // Act
          // POST with a non-existent user
          res = await request(app).post(API_ACHIEVE_GOAL_ENDPOINT).send({
            user_id: test_user_id,
            resolution_key: "non_existent_resolution",
            goal_key: test_goal_key_1,
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

      describe("Non-existent Goal", () => {
        let res: any, resBody: any;

        beforeAll(async () => {
          // Act
          // POST with a non-existent user
          res = await request(app).post(API_ACHIEVE_GOAL_ENDPOINT).send({
            user_id: test_user_id,
            resolution_key: test_resolution_key,
            goal_key: "non_existent_goal",
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
          completed: true,
        };

        // Act
        // update the goal "completed" field with the completed argument
        res = await request(app)
          .post(API_COMPLETE_GOAL_ENDPOINT)
          .send(completeBody);
      });

      // Assert
      it("Should return an HTTP Response Status of 200", () => {
        expect(res.statusCode).toEqual(200);
      });

      it("Should have changed the goal's completed field to true", async () => {
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
        expect(goal.completed).toEqual(true);
      });
    });

    describe("Erroneous Usage", () => {
      describe("Attempt to complete a goal that does not have nTimesToAchieve == 1", () => {
        let res: any, resBody: any;

        beforeAll(async () => {
          // Arrange
          await createSampleGoals();

          const completeBody: APICompleteGoalArguments = {
            user_id: test_user_id,
            resolution_key: test_resolution_key,
            goal_key: test_goal_key_2,
            completed: true,
          };

          // Act
          // try to update the goal "completed" field with the completed argument
          res = await request(app)
            .post(API_COMPLETE_GOAL_ENDPOINT)
            .send(completeBody);
          resBody = JSON.parse(res.text);
        });

        // Assert
        it("Should return an HTTP Response Status of 400", () => {
          expect(res.statusCode).toEqual(400);
        });

        it("Should indicate failure", () => {
          expect(resBody["success"]).toEqual(false);
        });

        it(`Should tell the caller to call ${API_ACHIEVE_GOAL_ENDPOINT} instead`, () => {
          expect(resBody["reason"]).toEqual(
            `nTimesToAchieve is not 1 -- call ${API_ACHIEVE_GOAL_ENDPOINT} instead`
          );
        });
      });

      describe("Invalid format of POST body", () => {
        let res: any, resBody: any;
        beforeAll(async () => {
          // Arrange
          const badPostBody: APICompleteGoalArguments = {
            user_id: test_user_id,
            resolution_key: test_resolution_key,
            goal_key: "",
            completed: false,
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
            completed: true,
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
            completed: true,
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

      describe("Non-existent Goal", () => {
        let res: any, resBody: any;

        // Arrange
        beforeAll(async () => {
          const badPostBody: APICompleteGoalArguments = {
            user_id: test_user_id,
            resolution_key: test_resolution_key,
            goal_key: "non_existent_goal",
            completed: true,
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

  describe(`POST ${API_UPDATE_GOAL_DESCRIPTION_ENDPOINT}`, () => {
    describe("Proper Functionality", () => {
      let res: any;
      beforeAll(async () => {
        // Arrange
        await createSampleGoals();

        const completeBody: APIUpdateGoalDescriptionArguments = {
          user_id: test_user_id,
          resolution_key: test_resolution_key,
          goal_key: test_goal_key_1,
          new_description: test_goal_updated_description_1,
        };

        // Act
        // update the goal "completed" field with the completed argument
        res = await request(app)
          .post(API_UPDATE_GOAL_DESCRIPTION_ENDPOINT)
          .send(completeBody);
      });

      // Assert
      it("Should return an HTTP Response Status of 200", () => {
        expect(res.statusCode).toEqual(200);
      });

      it("Should have updated the Goal's description field", async () => {
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
        expect(goal.description).toEqual(test_goal_updated_description_1);
      });
    });

    describe("Erroneous Usage", () => {
      describe("Invalid format of POST body", () => {
        let res: any, resBody: any;
        beforeAll(async () => {
          // Arrange
          const badPostBody: APIUpdateGoalDescriptionArguments = {
            user_id: test_user_id,
            resolution_key: test_resolution_key,
            goal_key: test_goal_key_1,
            new_description: "",
          };

          // Act
          // POST with a bad body format
          res = await request(app)
            .post(API_UPDATE_GOAL_DESCRIPTION_ENDPOINT)
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
          const badPostBody: APIUpdateGoalDescriptionArguments = {
            user_id: "non_existent_user",
            resolution_key: test_resolution_key,
            goal_key: test_goal_key_1,
            new_description: test_goal_updated_description_1,
          };

          // Act
          // POST with a non-existent user
          res = await request(app)
            .post(API_UPDATE_GOAL_DESCRIPTION_ENDPOINT)
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
          const badPostBody: APIUpdateGoalDescriptionArguments = {
            user_id: test_user_id,
            resolution_key: "non_existent_resolution",
            goal_key: test_goal_key_1,
            new_description: test_goal_updated_description_1,
          };

          // Act
          // POST with a non-existent user
          res = await request(app)
            .post(API_UPDATE_GOAL_DESCRIPTION_ENDPOINT)
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

      describe("Non-existent Goal", () => {
        let res: any, resBody: any;

        // Arrange
        beforeAll(async () => {
          const badPostBody: APIUpdateGoalDescriptionArguments = {
            user_id: test_user_id,
            resolution_key: test_resolution_key,
            goal_key: "non_existent_goal",
            new_description: test_goal_updated_description_1,
          };

          // Act
          // POST with a non-existent user
          res = await request(app)
            .post(API_UPDATE_GOAL_DESCRIPTION_ENDPOINT)
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

  describe(`POST ${API_DELETE_GOAL_ENDPOINT}`, () => {
    describe("Proper Functionality", () => {
      let res: any;
      beforeAll(async () => {
        // Arrange
        await createSampleGoals();

        const deleteBody: APIDeleteGoalArguments = {
          user_id: test_user_id,
          resolution_key: test_resolution_key,
          goal_key: test_goal_key_1,
        };

        // Act
        // delete the goal with the key test_goal_key_1
        res = await request(app)
          .post(API_DELETE_GOAL_ENDPOINT)
          .send(deleteBody);
      });

      // Assert
      it("Should return an HTTP Response Status of 200", () => {
        expect(res.statusCode).toEqual(200);
      });

      it("Should have successfully deleted the Goal (remaining count is 1)", async () => {
        const resolutionGoalsRef = ref(
          database,
          RTDB_RESOLUTIONS_PATH +
            test_user_id +
            "/" +
            test_resolution_key +
            "/goals"
        );

        const resolutionGoals: { [key: string]: Goal } = (
          await get(resolutionGoalsRef)
        ).val();
        expect(Object.keys(resolutionGoals).length).toEqual(1);
      });
    });

    describe("Erroneous Usage", () => {
      describe("Invalid format of POST body", () => {
        let res: any, resBody: any;
        beforeAll(async () => {
          // Arrange
          const badPostBody: APIDeleteGoalArguments = {
            user_id: test_user_id,
            resolution_key: test_resolution_key,
            goal_key: "",
          };

          // Act
          // POST with a bad body format
          res = await request(app)
            .post(API_DELETE_GOAL_ENDPOINT)
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
        beforeAll(async () => {
          // Arrange
          const badPostBody: APIDeleteGoalArguments = {
            user_id: "non_existent_user",
            resolution_key: test_resolution_key,
            goal_key: test_goal_key_1,
          };

          // Act
          // POST with a non-existent user
          res = await request(app)
            .post(API_DELETE_GOAL_ENDPOINT)
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
        beforeAll(async () => {
          // Arrange
          const badPostBody: APIDeleteGoalArguments = {
            user_id: test_user_id,
            resolution_key: "non_existent_resolution",
            goal_key: test_goal_key_1,
          };

          // Act
          // POST with a non-existent user
          res = await request(app)
            .post(API_DELETE_GOAL_ENDPOINT)
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
