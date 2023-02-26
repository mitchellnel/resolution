import app from "../app";

import request from "supertest";

describe("GET /", () => {
  it("Should return the correct HTTP Response Status of 200", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toEqual(200);
  });

  it("Should return the text 'Resolution API v1 -- look at https://github.com/mitchellnel/resolution/tree/main/server#api-documentation for endpoint documentation.'", async () => {
    const res = await request(app).get("/");

    expect(res.text).toEqual(
      "Resolution API v1 -- look at https://github.com/mitchellnel/resolution/tree/main/server#api-documentation for endpoint documentation."
    );
  });
});
