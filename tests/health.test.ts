import { Application } from "express";
import request from "supertest";
import app from "~/app";
import initDB, { DB } from "~/db";

describe("Health", () => {
  let db: DB, application: Application;

  before(async () => {
    db = await initDB(":memory:");
    application = app(db);
  });

  after(async () => {
    await db.close();
  });

  describe("GET /health", () => {
    it("should return health", (done) => {
      request(application)
        .get("/health")
        .expect("Content-Type", /text/)
        .expect(200, done);
    });
  });
});
