import { sha256 } from "js-sha256";

export const hashObject = (object: any): string => {
  const stringified = JSON.stringify(object);
  const hash = sha256(stringified);
  return hash;
};
