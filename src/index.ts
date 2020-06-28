import fs from "fs";
import jsyaml from "js-yaml";
import swaggerUi, { JsonObject } from "swagger-ui-express";
import app from "./app";
import db from "./db";
import buildSchemas from "./schemas";

const port = 8010;

(async () => {
  await db.serialize();
  await buildSchemas(db);

  const application = app(db);

  application.listen(port, () =>
    console.log(`App started and listening on port ${port}`),
  );

  const spec = fs.readFileSync("./doc/swagger.yml", "utf8");
  const oasDoc = jsyaml.safeLoad(spec) as JsonObject;
  application.use("/api-docs", swaggerUi.serve, swaggerUi.setup(oasDoc));
})();
