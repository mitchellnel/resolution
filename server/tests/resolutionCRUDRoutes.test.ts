import request from "supertest";

import app from "../app";
import {
  API_CREATE_RESOLUTION_ENDPOINT,
  API_READ_RESOLUTION_ENDPOINT,
  API_UPDATE_RESOLUTION_ENDPOINT,
  API_DELETE_RESOLUTION_ENDPOINT,
} from "../constants/apiEndpoints";
import {
  APICreateResolutionArguments,
  APIReadResolutionReturn,
  APIDeleteResolutionArguments,
  APIUpdateResolutionArguments,
} from "../constants/apiInterfaces";

describe("Test ResolutionDB CRUD API", () => {
  const test_user_id = "test_user_21";
  const test_title = "Test Resolution Title 21";
  const test_description = "Test Resolution Description 21";

  const test_updated_description = "Test Resolution Description 21.21";

  describe(`GET ${API_READ_RESOLUTION_ENDPOINT}`, () => {
    describe("Proper Functionality", () => {
      let res: any, resBody: any;

      beforeAll(async () => {
        // get resolutions for user_id=lh44
        res = await request(app).get(
          `${API_READ_RESOLUTION_ENDPOINT}?user_id=lh44`
        );
        resBody = JSON.parse(res.text);
      });

      it("Should return an HTTP Response Status of 200", async () => {
        expect(res.statusCode).toEqual(200);
      });

      it("Should return the resolutions (count is 2) for user_id=lh44", async () => {
        const resolutions = resBody["resolutions"];

        expect(Object.keys(resolutions).length).toEqual(2);
      });
    });

    describe("Erroneous Usage", () => {
      describe("Invalid format for query parameters", () => {
        let res: any, resBody: any;

        beforeAll(async () => {
          // do not provide the necessary query parameters
          res = await request(app).get(`${API_READ_RESOLUTION_ENDPOINT}`);
          resBody = JSON.parse(res.text);
        });

        it("Should return an HTTP Response Status of 400", async () => {
          expect(res.statusCode).toEqual(400);
        });

        it("Should indicate failure", async () => {
          expect(resBody["success"]).toBeFalsy;
        });

        it("Should have a defined failure reason", async () => {
          expect(resBody["reason"]).toBeDefined;
        });
      });

      describe("Invalid user_id", () => {
        let res: any, resBody: any;

        beforeAll(async () => {
          // provide a user_id that doesn't exist in the DB
          res = await request(app).get(
            `${API_READ_RESOLUTION_ENDPOINT}?user_id=not-a-real-user`
          );
          resBody = JSON.parse(res.text);
        });

        it("Should return an HTTP Response Status of 404", async () => {
          expect(res.statusCode).toEqual(404);
        });

        it("Should indicate failure", async () => {
          expect(resBody["success"]).toBeFalsy;
        });

        it("Should have a defined failure reason", async () => {
          expect(resBody["reason"]).toBeDefined;
        });
      });
    });
  });

  describe(`POST ${API_CREATE_RESOLUTION_ENDPOINT}`, () => {
    describe("Proper Functionality", () => {
      const postBody: APICreateResolutionArguments = {
        user_id: test_user_id,
        title: test_title,
        description: test_description,
      };

      let res: any,
        readRes: any,
        readResBody: any,
        readResResolutionKey: any,
        readResResolution: any;

      beforeAll(async () => {
        // create a resolution for test_user_id
        res = await request(app)
          .post(`${API_CREATE_RESOLUTION_ENDPOINT}`)
          .send(postBody);

        // read the resolutions for test_user_id
        //   -- if an error is thrown here we already know that /api/create-resolution didn't work
        readRes = await request(app).get(
          `${API_READ_RESOLUTION_ENDPOINT}?user_id=${test_user_id}`
        );
        readResBody = JSON.parse(readRes.text) as APIReadResolutionReturn;

        // extract the actual resolution and its key in the DB
        const readResolutions = readResBody["resolutions"];
        readResResolutionKey = Object.keys(readResolutions)[0];
        readResResolution = readResolutions[readResResolutionKey];
      });

      it("Should return an HTTP Response Status of 200", async () => {
        expect(res.statusCode).toEqual(200);
      });

      it("Should have correctly created the Resolution in ResolutionDB", async () => {
        expect(readResResolution!["title"]).toEqual(test_title);
        expect(readResResolution!["description"]).toEqual(test_description);
      });

      afterAll(async () => {
        // delete the created test resolution
        const deletePostBody: APIDeleteResolutionArguments = {
          user_id: test_user_id,
          firebase_key: readResResolutionKey,
        };

        await request(app)
          .post(`${API_DELETE_RESOLUTION_ENDPOINT}`)
          .send(deletePostBody);
      });
    });

    describe("Erroneous Usage", () => {
      describe("Invalid format of POST body", () => {
        const badPostBody: APICreateResolutionArguments = {
          user_id: test_user_id,
          title: "",
          description: "",
        };

        let res: any, resBody: any;

        beforeAll(async () => {
          // POST with a bad body format
          res = await request(app)
            .post(`${API_CREATE_RESOLUTION_ENDPOINT}`)
            .send(badPostBody);
          resBody = JSON.parse(res.text);
        });

        it("Should return an HTTP Response Status of 400", async () => {
          expect(res.statusCode).toEqual(400);
        });

        it("Should indicate failure", async () => {
          expect(resBody["success"]).toBeFalsy;
        });

        it("Should have a defined failure reason", async () => {
          expect(resBody["reason"]).toBeDefined;
        });
      });
    });
  });

  describe(`POST ${API_UPDATE_RESOLUTION_ENDPOINT}`, () => {
    describe("Proper Functionality", () => {
      const createPostBody: APICreateResolutionArguments = {
        user_id: test_user_id,
        title: test_title,
        description: test_description,
      };

      let res: any, readResResolutionKey: any, readResResolution: any;

      beforeAll(async () => {
        // create a resolution for test_user_id
        await request(app)
          .post(`${API_CREATE_RESOLUTION_ENDPOINT}`)
          .send(createPostBody);

        // read the resolutions for test_user_id
        let readRes = await request(app).get(
          `${API_READ_RESOLUTION_ENDPOINT}?user_id=${test_user_id}`
        );
        let readResBody = JSON.parse(readRes.text) as APIReadResolutionReturn;

        // get the key of the created resolution in the DB
        let readResolutions = readResBody["resolutions"];
        readResResolutionKey = Object.keys(readResolutions!)[0];

        const updatePostBody: APIUpdateResolutionArguments = {
          user_id: test_user_id,
          firebase_key: readResResolutionKey,
          new_title: test_title,
          new_description: test_updated_description,
        };

        // update that resolution
        res = await request(app)
          .post(`${API_UPDATE_RESOLUTION_ENDPOINT}`)
          .send(updatePostBody);

        // read the resolutions for test_user_id again
        readRes = await request(app).get(
          `${API_READ_RESOLUTION_ENDPOINT}?user_id=${test_user_id}`
        );
        readResBody = JSON.parse(readRes.text) as APIReadResolutionReturn;

        // get the key of the created resolution in the DB
        readResolutions = readResBody["resolutions"];
        readResResolution = readResolutions![readResResolutionKey];
      });

      it("Should return an HTTP Response Status of 200", async () => {
        expect(res.statusCode).toEqual(200);
      });

      it("Should have correctly updated the Resolution in ResolutionDB to the new description", async () => {
        expect(readResResolution!["title"]).toEqual(test_title);
        expect(readResResolution!["description"]).toEqual(
          test_updated_description
        );
      });

      afterAll(async () => {
        // delete the created test resolution
        const deletePostBody: APIDeleteResolutionArguments = {
          user_id: test_user_id,
          firebase_key: readResResolutionKey,
        };

        await request(app)
          .post(`${API_DELETE_RESOLUTION_ENDPOINT}`)
          .send(deletePostBody);
      });
    });

    describe("Erroneous Usage", () => {
      describe("Invalid format of POST body", () => {
        const badPostBody = {
          user_id: test_user_id,
          new_title: "A new title",
          new_description: "A new description",
        };

        let res: any, resBody: any;

        beforeAll(async () => {
          // POST with a bad body format
          res = await request(app)
            .post(`${API_UPDATE_RESOLUTION_ENDPOINT}`)
            .send(badPostBody);
          resBody = JSON.parse(res.text);
        });

        it("Should return an HTTP Response Status of 400", async () => {
          expect(res.statusCode).toEqual(400);
        });

        it("Should indicate failure", async () => {
          expect(resBody["success"]).toBeFalsy;
        });

        it("Should have a defined failure reason", async () => {
          expect(resBody["reason"]).toBeDefined;
        });
      });
    });
  });

  describe(`POST ${API_DELETE_RESOLUTION_ENDPOINT}`, () => {
    describe("Proper Functionality", () => {
      const createPostBody: APICreateResolutionArguments = {
        user_id: test_user_id,
        title: test_title,
        description: test_description,
      };

      let res: any;

      beforeAll(async () => {
        // create a resolution for test_user_id
        await request(app)
          .post(`${API_CREATE_RESOLUTION_ENDPOINT}`)
          .send(createPostBody);

        // read the resolutions for test_user_id
        const readRes = await request(app).get(
          `${API_READ_RESOLUTION_ENDPOINT}?user_id=${test_user_id}`
        );
        const readResBody = JSON.parse(readRes.text) as APIReadResolutionReturn;

        // get the key of the created resolution in the DB
        const readResolutions = readResBody["resolutions"];
        const readResResolutionKey = Object.keys(readResolutions!)[0];

        const deletePostBody: APIDeleteResolutionArguments = {
          user_id: test_user_id,
          firebase_key: readResResolutionKey,
        };

        res = await request(app)
          .post(`${API_DELETE_RESOLUTION_ENDPOINT}`)
          .send(deletePostBody);
      });

      it("Should return an HTTP Response Status of 200", async () => {
        expect(res.statusCode).toEqual(200);
      });
    });

    describe("Erroneous Usage", () => {
      describe("Invalid format of POST body", () => {
        const badPostBody = {};

        let res: any, resBody: any;

        beforeAll(async () => {
          // POST with a bad body format
          res = await request(app)
            .post(`${API_DELETE_RESOLUTION_ENDPOINT}`)
            .send(badPostBody);
          resBody = JSON.parse(res.text);
        });

        it("Should return an HTTP Response Status of 400", async () => {
          expect(res.statusCode).toEqual(400);
        });

        it("Should indicate failure", async () => {
          expect(resBody["success"]).toBeFalsy;
        });

        it("Should have a defined failure reason", async () => {
          expect(resBody["reason"]).toBeDefined;
        });
      });
    });
  });
});
