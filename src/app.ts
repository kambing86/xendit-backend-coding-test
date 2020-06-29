import cors from "cors";
import express, { Application } from "express";
import health from "./controller/health";
import rides from "./controller/rides";
import { DB } from "./db";

export default (db: DB): Application => {
  const app = express();
  app.use(cors());

  health(app);
  rides(app, db);

  return app;
};
