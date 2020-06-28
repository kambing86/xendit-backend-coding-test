import { verbose } from "sqlite3";
import request from "supertest";
import app from "../src/app";
import buildSchemas from "../src/schemas";

const sqlite3 = verbose();
const db = new sqlite3.Database(":memory:");
const application = app(db);

describe("API tests", () => {
  before((done) => {
    // @ts-ignore
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
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
