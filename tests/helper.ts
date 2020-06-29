import { Test } from "supertest";

export function requestToPromise(req: Test): Promise<void> {
  return new Promise((resolve, reject) =>
    req.end((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    }),
  );
}
