export const isValue = <T>(value: T) => (inputType: T): boolean => {
  return inputType === value;
};