import { Node } from 'slate';

export const serializeNodes = (value: any[]) => {
  return value
  .map(n => Node
  .string(n))
  .join('\n')
}