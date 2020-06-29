import SQL from "@nearform/sql";
import bodyParser from "body-parser";
import { Application } from "express";
import { RunResult } from "sqlite3";
import { SERVER_ERROR, VALIDATION_ERROR } from "~/constants";
import { DB } from "~/db";
import { RideInput } from "~/types";

export default (app: Application, db: DB): void => {
  const jsonParser = bodyParser.json();
  app.post("/rides", jsonParser, async (req, res) => {
    const {
      startLat,
      startLong,
      endLat,
      endLong,
      riderName,
      driverName,
      driverVehicle,
    } = <RideInput>req.body;
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

    let result: RunResult;
    try {
      result = await db.run(
        SQL`
        INSERT INTO Rides
        (startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle)
        VALUES 
        (${startLat}, ${startLong}, ${endLat}, ${endLong}, ${riderName}, ${driverName}, ${driverVehicle})`,
      );
    } catch {
      return res.status(500).send({
        error_code: SERVER_ERROR,
        message: "Unknown error",
      });
    }
    try {
      const rows = await db.all(
        SQL`SELECT * FROM Rides WHERE rideID = ${result.lastID}`,
      );
      res.send(rows[0]);
    } catch {
      return res.status(500).send({
        error_code: SERVER_ERROR,
        message: "Unknown error",
      });
    }
  });
};
