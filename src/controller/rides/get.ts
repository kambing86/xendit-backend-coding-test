import { Application } from "express";
import { RIDES_NOT_FOUND_ERROR, SERVER_ERROR } from "~/constants";
import { DB } from "~/db";
import SQL from "@nearform/sql";

export default (app: Application, db: DB): void => {
  app.get("/rides", async (req, res) => {
    const { offset, limit } = req.query;
    const sqlQuery = SQL`SELECT * FROM Rides`;
    if (limit !== undefined) {
      sqlQuery.append(SQL` LIMIT ${limit}`);
    } else {
      sqlQuery.append(SQL` LIMIT 100`);
    }
    if (offset !== undefined) {
      sqlQuery.append(SQL` OFFSET ${offset}`);
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
};
