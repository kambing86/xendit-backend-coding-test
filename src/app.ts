import bodyParser from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import { Database } from "sqlite3";

const app = express();
const jsonParser = bodyParser.json();

app.use(cors());

type Ride = {
  startLat: number | string;
  startLong: number | string;
  endLat: number | string;
  endLong: number | string;
  riderName: string;
  driverName: string;
  driverVehicle: string;
};

export default (db: Database): Application => {
  app.get("/health", (req, res) => res.send("Healthy"));

  app.post("/rides", jsonParser, (req, res) => {
    const {
      startLat,
      startLong,
      endLat,
      endLong,
      riderName,
      driverName,
      driverVehicle,
    } = req.body as Ride;
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
        error_code: "VALIDATION_ERROR",
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
        error_code: "VALIDATION_ERROR",
        message:
          "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively",
      });
    }

    if (typeof riderName !== "string" || riderName.length < 1) {
      return res.status(422).send({
        error_code: "VALIDATION_ERROR",
        message: "Rider name must be a non empty string",
      });
    }

    if (typeof driverName !== "string" || driverName.length < 1) {
      return res.status(422).send({
        error_code: "VALIDATION_ERROR",
        message: "Rider name must be a non empty string",
      });
    }

    if (typeof driverVehicle !== "string" || driverVehicle.length < 1) {
      return res.status(422).send({
        error_code: "VALIDATION_ERROR",
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

    const result = db.run(
      "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)",
      values,
      function (err) {
        if (err) {
          return res.status(500).send({
            error_code: "SERVER_ERROR",
            message: "Unknown error",
          });
        }

        db.all(
          "SELECT * FROM Rides WHERE rideID = ?",
          this.lastID,
          (err, rows) => {
            if (err) {
              return res.status(500).send({
                error_code: "SERVER_ERROR",
                message: "Unknown error",
              });
            }

            res.send(rows[0]);
          },
        );
      },
    );
  });

  app.get("/rides", (req, res) => {
    const { offset, limit } = req.query;
    let sqlQuery = `SELECT * FROM Rides`;
    if (limit !== undefined) {
      sqlQuery = `${sqlQuery} LIMIT ${limit}`;
    }
    if (offset !== undefined) {
      sqlQuery = `${sqlQuery} OFFSET ${offset}`;
    }
    db.all(sqlQuery, (err, rows) => {
      if (err) {
        return res.status(500).send({
          error_code: "SERVER_ERROR",
          message: "Unknown error",
        });
      }

      if (rows.length === 0) {
        return res.status(404).send({
          error_code: "RIDES_NOT_FOUND_ERROR",
          message: "Could not find any rides",
        });
      }

      res.send(rows);
    });
  });

  app.get("/rides/:id", (req, res) => {
    db.all(
      `SELECT * FROM Rides WHERE rideID='${req.params.id}'`,
      (err, rows) => {
        if (err) {
          return res.status(500).send({
            error_code: "SERVER_ERROR",
            message: "Unknown error",
          });
        }

        if (rows.length === 0) {
          return res.status(404).send({
            error_code: "RIDES_NOT_FOUND_ERROR",
            message: "Could not find any rides",
          });
        }

        res.send(rows[0]);
      },
    );
  });

  return app;
};
