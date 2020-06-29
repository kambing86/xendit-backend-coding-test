import fs from "fs";
import jsyaml from "js-yaml";
import swaggerUi, { JsonObject } from "swagger-ui-express";
import app from "./app";
import initDB from "./db";

const port = 8010;

(async () => {
  const db = await initDB(":memory:");
  const application = app(db);

  application.listen(port, () =>
    console.log(`App started and listening on port ${port}`),
  );

  const spec = fs.readFileSync("./doc/swagger.yml", "utf8");
  const oasDoc = <JsonObject>jsyaml.safeLoad(spec);
  application.use("/api-docs", swaggerUi.serve, swaggerUi.setup(oasDoc));
})();
