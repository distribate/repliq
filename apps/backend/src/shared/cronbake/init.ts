import Baker from "cronbake";

export const baker = Baker.create();

export function getBaker() {
  if (!baker) {
    throw new Error("\x1B[35m[Baker]\x1B[0m Client is not inited")
  }

  return baker;
}

export function initBaker() {
  const baker = getBaker()

  baker && console.log("\x1B[35m[Baker]\x1B[0m Started")
}