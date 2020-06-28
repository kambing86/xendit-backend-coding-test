import fs from "fs";
import jsyaml from "js-yaml";
import { verbose } from "sqlite3";
import swaggerUi, { JsonObject } from "swagger-ui-express";
import app from "./app";
import buildSchemas from "./schemas";

const port = 8010;
const sqlite3 = verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  buildSchemas(db);

  const application = app(db);

  application.listen(port, () =>
    console.log(`App started and listening on port ${port}`),
  );

  const spec = fs.readFileSync("./doc/swagger.yml", "utf8");
  const oasDoc = jsyaml.safeLoad(spec) as JsonObject;
  application.use("/api-docs", swaggerUi.serve, swaggerUi.setup(oasDoc));
});
