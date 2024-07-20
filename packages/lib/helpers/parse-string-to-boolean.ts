export const parseStringToBoolean = (input: string): boolean => {
  if (input === 'true') {
    return true
  } else if (input === 'false') {
    return false
  } else {
    throw new Error(`Invalid boolean string: ${input}`);
  }
};