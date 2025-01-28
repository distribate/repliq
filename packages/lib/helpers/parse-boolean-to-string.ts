export const parseBooleanToString = (input: boolean): "true" | "false" => {
  if (input === true) {
    return "true";
  } else if (input === false) {
    return "false";
  }

  throw new Error(`Invalid string boolean: ${input}`);
};