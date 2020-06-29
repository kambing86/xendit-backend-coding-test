import { Application } from "express";
import { DB } from "~/db";
import get from "./get";
import getById from "./getById";
import post from "./post";

export default (app: Application, db: DB): void => {
  get(app, db);
  getById(app, db);
  post(app, db);
};
