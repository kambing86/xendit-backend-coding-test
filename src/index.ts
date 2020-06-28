import { verbose } from "sqlite3";
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
});
