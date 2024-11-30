import { Node } from 'slate';

export const deserializeNodes = (value: string) => {
  return value.split('\n').map(line => {
    return { children: [{ text: line }], }
  })
}

export const serializeNodes = (value: any[]) => value.map(n => Node.string(n)).join('\n')