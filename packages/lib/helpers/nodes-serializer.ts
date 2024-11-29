import { Node } from 'slate';

export const serializeNodes = (value: any[]) => value.map(n => Node.string(n)).join('\n')