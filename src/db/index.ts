import getDB, { DB } from "./getDB";
import buildSchemas from "./schemas";

export { DB };

export default async (filename: string): Promise<DB> => {
  const db = getDB(filename);
  await db.serialize();
  await buildSchemas(db);
  return db;
};
