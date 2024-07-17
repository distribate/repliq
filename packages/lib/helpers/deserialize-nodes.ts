

// Define a deserializing function that takes a string and returns a value.
export const deserializeNodes = (value: string) => {
  // Return a value array of children derived by splitting the string.
  return value.split('\n').map(line => {
    return {
      children: [{ text: line }],
    }
  })
}