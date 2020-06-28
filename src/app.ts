import bodyParser from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import { RunResult } from "sqlite3";
import { DB } from "./getDB";
import { RideInput } from "./types";

export const VALIDATION_ERROR = "VALIDATION_ERROR";
export const RIDES_NOT_FOUND_ERROR = "RIDES_NOT_FOUND_ERROR";
export const SERVER_ERROR = "SERVER_ERROR";

const app = express();
const jsonParser = bodyParser.json();

app.use(cors());

export default (db: DB): Application => {
  app.get("/health", (req, res) => res.send("Healthy"));

  app.post("/rides", jsonParser, async (req, res) => {
    const {
      startLat,
      startLong,
      endLat,
      endLong,
      riderName,
      driverName,
      driverVehicle,
    } = req.body as RideInput;
    const startLatitude = Number(startLat);
    const startLongitude = Number(startLong);
    const endLatitude = Number(endLat);
    const endLongitude = Number(endLong);

    if (
      startLatitude < -90 ||
      startLatitude > 90 ||
      startLongitude < -180 ||
      startLongitude > 180
    ) {
      return res.status(422).send({
        error_code: VALIDATION_ERROR,
        message:
          "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively",
      });
    }

    if (
      endLatitude < -90 ||
      endLatitude > 90 ||
      endLongitude < -180 ||
      endLongitude > 180
    ) {
      return res.status(422).send({
        error_code: VALIDATION_ERROR,
        message:
          "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively",
      });
    }

    if (typeof riderName !== "string" || riderName.length < 1) {
      return res.status(422).send({
        error_code: VALIDATION_ERROR,
        message: "Rider name must be a non empty string",
      });
    }

    if (typeof driverName !== "string" || driverName.length < 1) {
      return res.status(422).send({
        error_code: VALIDATION_ERROR,
        message: "Rider name must be a non empty string",
      });
    }

    if (typeof driverVehicle !== "string" || driverVehicle.length < 1) {
      return res.status(422).send({
        error_code: VALIDATION_ERROR,
        message: "Rider name must be a non empty string",
      });
    }

    const values = [
      startLat,
      startLong,
      endLat,
      endLong,
      riderName,
      driverName,
      driverVehicle,
    ];

    let result: RunResult;
    try {
      result = await db.run(
        "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)",
        values,
      );
    } catch {
      return res.status(500).send({
        error_code: SERVER_ERROR,
        message: "Unknown error",
      });
    }
    try {
      const rows = await db.all(
        "SELECT * FROM Rides WHERE rideID = ?",
        result.lastID,
      );
      res.send(rows[0]);
    } catch {
      return res.status(500).send({
        error_code: SERVER_ERROR,
        message: "Unknown error",
      });
    }
  });

  app.get("/rides", async (req, res) => {
    const { offset, limit } = req.query;
    let sqlQuery = `SELECT * FROM Rides`;
    if (limit !== undefined) {
      sqlQuery = `${sqlQuery} LIMIT ${limit}`;
    } else {
      sqlQuery = `${sqlQuery} LIMIT 100`;
    }
    if (offset !== undefined) {
      sqlQuery = `${sqlQuery} OFFSET ${offset}`;
    }

    try {
      const rows = await db.all(sqlQuery);
      if (rows.length === 0) {
        return res.status(404).send({
          error_code: RIDES_NOT_FOUND_ERROR,
          message: "Could not find any rides",
        });
      }
      res.send(rows);
    } catch {
      return res.status(500).send({
        error_code: SERVER_ERROR,
        message: "Unknown error",
      });
    }
  });

  app.get("/rides/:id", async (req, res) => {
    try {
      const rows = await db.all(
        `SELECT * FROM Rides WHERE rideID='${req.params.id}'`,
      );
      if (rows.length === 0) {
        return res.status(404).send({
          error_code: RIDES_NOT_FOUND_ERROR,
          message: "Could not find any rides",
        });
      }
      res.send(rows[0]);
    } catch {
      return res.status(500).send({
        error_code: SERVER_ERROR,
        message: "Unknown error",
      });
    }
  });

  return app;
};
