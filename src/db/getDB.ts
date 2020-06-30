import { SqlStatement } from "@nearform/sql";
import Sqlite3, { RunResult } from "sqlite3";
import { promisify } from "util";

function getDB(filename: string) {
  const sqlite3 = Sqlite3.verbose();
  const db = new sqlite3.Database(filename);

  return {
    serialize: promisify(db.serialize).bind(db),
    run: (sql: SqlStatement): Promise<RunResult> => {
      return new Promise((resolve, reject) => {
        db.run(sql.sql, sql.values, function (err) {
          if (err) {
            return reject(err);
          }
          resolve(this);
        });
      });
    },
    all: (sql: SqlStatement): Promise<unknown[]> => {
      return new Promise((resolve, reject) => {
        db.all(sql.sql, sql.values, (err, rows) => {
          if (err) {
            return reject(err);
          }
          resolve(rows);
        });
      });
    },
    close: promisify(db.close).bind(db),
  };
}

export type DB = ReturnType<typeof getDB>;

export default getDB;
