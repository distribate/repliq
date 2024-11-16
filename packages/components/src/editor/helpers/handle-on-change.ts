import { BaseEditor, Descendant } from 'slate';
import { OperationType } from '@repo/types/global';

export const handleOnChangeEditor = (editor: BaseEditor, value: Descendant[]) => {
  return editor.operations.some(
    (op: { type: OperationType; }) => 'set_selection' !== op.type,
  );
};