import { RunResult, verbose } from "sqlite3";
import { promisify } from "util";

function getDB() {
  const sqlite3 = verbose();
  const db = new sqlite3.Database(":memory:");

  return {
    serialize: promisify(db.serialize).bind(db),
    run: (sql: string, params?: unknown): Promise<RunResult> => {
      return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
          if (err) {
            return reject(err);
          }
          resolve(this);
        });
      });
    },
    all: (sql: string, params?: unknown): Promise<unknown[]> => {
      return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) {
            return reject(err);
          }
          resolve(rows);
        });
      });
    },
  };
}

export type DB = ReturnType<typeof getDB>;

export default getDB();
