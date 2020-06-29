import { Application } from "express";

export default (app: Application): void => {
  app.get("/health", (_req, res) => res.send("Healthy"));
};
