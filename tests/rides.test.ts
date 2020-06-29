import { expect } from "chai";
import { Application } from "express";
import request from "supertest";
import app from "~/app";
import { RIDES_NOT_FOUND_ERROR, VALIDATION_ERROR } from "~/constants";
import initDB, { DB } from "~/db";
import { RideInput } from "~/types";
import { requestToPromise } from "./helper";
import SQL from "@nearform/sql";

describe("Rides", () => {
  let db: DB, application: Application;

  before(async () => {
    db = await initDB(":memory:");
    application = app(db);
  });

  after(async () => {
    db.close();
  });

  const payload: RideInput = {
    startLat: 10,
    startLong: 20,
    endLat: 30,
    endLong: 40,
    riderName: "a",
    driverName: "b",
    driverVehicle: "c",
  };

  before(async () => {
    // prepopolate 3 rides
    await requestToPromise(request(application).post("/rides").send(payload));
    await requestToPromise(request(application).post("/rides").send(payload));
    await requestToPromise(request(application).post("/rides").send(payload));
  });

  describe("POST /rides", () => {
    it("should return the ride after POST if success", (done) => {
      request(application)
        .post("/rides")
        .send(payload)
        .expect("Content-Type", /application\/json/)
        .expect((res) => {
          const rideID = 4;
          expect(res.body.rideID).to.eql(rideID);
          expect(res.body).to.eql({
            rideID,
            ...payload,
            created: res.body.created,
          });
        })
        .expect(200, done);
    });

    it("should return error code if startLat not in range", async () => {
      await requestToPromise(
        request(application)
          .post("/rides")
          .send({
            ...payload,
            startLat: -91,
          })
          .expect("Content-Type", /application\/json/)
          .expect((res) => {
            expect(res.body["error_code"]).to.eql(VALIDATION_ERROR);
          })
          .expect(422),
      );
      await requestToPromise(
        request(application)
          .post("/rides")
          .send({
            ...payload,
            startLat: 91,
          })
          .expect("Content-Type", /application\/json/)
          .expect((res) => {
            expect(res.body["error_code"]).to.eql(VALIDATION_ERROR);
          })
          .expect(422),
      );
    });

    it("should return error code if startLong not in range", async () => {
      await requestToPromise(
        request(application)
          .post("/rides")
          .send({
            ...payload,
            startLong: -181,
          })
          .expect("Content-Type", /application\/json/)
          .expect((res) => {
            expect(res.body["error_code"]).to.eql(VALIDATION_ERROR);
          })
          .expect(422),
      );
      await requestToPromise(
        request(application)
          .post("/rides")
          .send({
            ...payload,
            startLong: 181,
          })
          .expect("Content-Type", /application\/json/)
          .expect((res) => {
            expect(res.body["error_code"]).to.eql(VALIDATION_ERROR);
          })
          .expect(422),
      );
    });

    it("should return error code if endLat not in range", async () => {
      await requestToPromise(
        request(application)
          .post("/rides")
          .send({
            ...payload,
            endLat: -91,
          })
          .expect("Content-Type", /application\/json/)
          .expect((res) => {
            expect(res.body["error_code"]).to.eql(VALIDATION_ERROR);
          })
          .expect(422),
      );
      await requestToPromise(
        request(application)
          .post("/rides")
          .send({
            ...payload,
            endLat: 91,
          })
          .expect("Content-Type", /application\/json/)
          .expect((res) => {
            expect(res.body["error_code"]).to.eql(VALIDATION_ERROR);
          })
          .expect(422),
      );
    });

    it("should return error code if endLong not in range", async () => {
      await requestToPromise(
        request(application)
          .post("/rides")
          .send({
            ...payload,
            endLong: -181,
          })
          .expect("Content-Type", /application\/json/)
          .expect((res) => {
            expect(res.body["error_code"]).to.eql(VALIDATION_ERROR);
          })
          .expect(422),
      );
      await requestToPromise(
        request(application)
          .post("/rides")
          .send({
            ...payload,
            endLong: 181,
          })
          .expect("Content-Type", /application\/json/)
          .expect((res) => {
            expect(res.body["error_code"]).to.eql(VALIDATION_ERROR);
          })
          .expect(422),
      );
    });

    it("should return error code if riderName not valid", async () => {
      await requestToPromise(
        request(application)
          .post("/rides")
          .send({
            ...payload,
            riderName: "",
          })
          .expect("Content-Type", /application\/json/)
          .expect((res) => {
            expect(res.body["error_code"]).to.eql(VALIDATION_ERROR);
          })
          .expect(422),
      );
      await requestToPromise(
        request(application)
          .post("/rides")
          .send({
            ...payload,
            riderName: 1,
          })
          .expect("Content-Type", /application\/json/)
          .expect((res) => {
            expect(res.body["error_code"]).to.eql(VALIDATION_ERROR);
          })
          .expect(422),
      );
    });

    it("should return error code if driverName not valid", async () => {
      await requestToPromise(
        request(application)
          .post("/rides")
          .send({
            ...payload,
            driverName: "",
          })
          .expect("Content-Type", /application\/json/)
          .expect((res) => {
            expect(res.body["error_code"]).to.eql(VALIDATION_ERROR);
          })
          .expect(422),
      );
      await requestToPromise(
        request(application)
          .post("/rides")
          .send({
            ...payload,
            driverName: 1,
          })
          .expect("Content-Type", /application\/json/)
          .expect((res) => {
            expect(res.body["error_code"]).to.eql(VALIDATION_ERROR);
          })
          .expect(422),
      );
    });

    it("should return error code if driverVehicle not valid", async () => {
      await requestToPromise(
        request(application)
          .post("/rides")
          .send({
            ...payload,
            driverVehicle: "",
          })
          .expect("Content-Type", /application\/json/)
          .expect((res) => {
            expect(res.body["error_code"]).to.eql(VALIDATION_ERROR);
          })
          .expect(422),
      );
      await requestToPromise(
        request(application)
          .post("/rides")
          .send({
            ...payload,
            driverVehicle: 1,
          })
          .expect("Content-Type", /application\/json/)
          .expect((res) => {
            expect(res.body["error_code"]).to.eql(VALIDATION_ERROR);
          })
          .expect(422),
      );
    });
  });

  describe("GET /rides", () => {
    it("should get all rides without offset / limit", (done) => {
      request(application)
        .get("/rides")
        .expect("Content-Type", /application\/json/)
        .expect((res) => {
          expect(res.body.length).to.greaterThan(3);
        })
        .expect(200, done);
    });

    it("should get rides with offset / limit", (done) => {
      request(application)
        .get("/rides?offset=1&limit=2")
        .expect("Content-Type", /application\/json/)
        .expect(({ body }) => {
          expect(body.length).to.eql(2);
          // should not able to find first ride
          const found = body.find((r) => r.rideID === 1);
          expect(found).to.eql(undefined, "should not contain first ride");
        })
        .expect(200, done);
    });

    it("should return error if cannot find any", (done) => {
      request(application)
        .get("/rides?offset=100&limit=2")
        .expect("Content-Type", /application\/json/)
        .expect(({ body }) => {
          expect(body["error_code"]).to.eql(RIDES_NOT_FOUND_ERROR);
        })
        .expect(404, done);
    });
  });

  describe("GET /rides/{id}", () => {
    it("should return ride if found the id", (done) => {
      request(application)
        .get("/rides/2")
        .expect("Content-Type", /application\/json/)
        .expect(({ body }) => {
          expect(body.rideID).to.eql(2);
        })
        .expect(200, done);
    });

    it("should return error if cannot find any", (done) => {
      request(application)
        .get("/rides/1000")
        .expect("Content-Type", /application\/json/)
        .expect(({ body }) => {
          expect(body["error_code"]).to.eql(RIDES_NOT_FOUND_ERROR);
        })
        .expect(404, done);
    });

    it("should prevent sql injection attack", (done) => {
      request(application)
        .get("/rides/1;DELETE FROM Rides")
        .expect("Content-Type", /application\/json/)
        .expect(async () => {
          const rows = await db.all(SQL`select * from rides`);
          expect(rows).to.have.length.greaterThan(0);
        })
        .expect(404, done);
    });
  });
});
