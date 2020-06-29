import { Application } from "express";
import { RIDES_NOT_FOUND_ERROR, SERVER_ERROR } from "~/constants";
import { DB } from "~/db";

export default (app: Application, db: DB): void => {
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
};
