'use client';

import { useState } from 'react';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { createEditor, Descendant } from 'slate';
import { RenderElement } from '#editor/components/render-element.tsx';
import { RenderLeaf } from '#editor/components/render-leaf.tsx';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@repo/ui/src/components/context-menu.tsx';
import { PencilLine } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  THREAD_CONTROL_QUERY_KEY,
  threadControlQuery,
} from '#thread/components/thread-control/queries/thread-control-query.ts';
import { useThreadControl } from '#thread/components/thread-control/hooks/use-thread-control.ts';
import { serializeNodes } from '@repo/lib/helpers/serialize-nodes.ts';
import { useController, useForm } from 'react-hook-form';
import { Button } from '@repo/ui/src/components/button.tsx';
import { handleOnChangeEditor } from '#editor/helpers/handle-on-change.ts';
import { ThreadModel } from '#thread/queries/get-thread-model.ts';
import { ThreadControlSave } from '#thread/components/thread-control/components/thread-control-save.tsx';
import { useQueryClient } from '@tanstack/react-query';

type ThreadContentProps = {
  content: Descendant[],
  isOwner: boolean
} & Pick<ThreadModel, 'id'>

const initialValue = [
  {
    type: 'paragraph',
    children: [ { text: 'Произошла ошибка при загрузке контента!', } ],
  },
];

export const ThreadContent = ({
  content, isOwner, id: threadId,
}: ThreadContentProps) => {
  const qc = useQueryClient();
  const { data: controlState } = threadControlQuery();
  const { setThreadNewValuesMutation } = useThreadControl();
  const [ editor ] = useState<ReactEditor>(() => withReact(createEditor()));
  const { control } = useForm();
  
  const { field: { onChange } } = useController(
    { name: 'content', control, rules: { required: true } },
  );
  
  const handleContentEdit = () => {
    return setThreadNewValuesMutation.mutate({
      state: { isContenteditable: true }
    })
  };
  
  const handleOnChange = (value: Descendant[]) => {
    const isAstChange = handleOnChangeEditor(editor, value);
    
    if (isAstChange) {
      return setThreadNewValuesMutation.mutate({
        state: {
          isValid: controlState.values ? controlState.values.content !== content : false
        },
        values: { content: value }
      });
    }
  };
  
  const handleCancelEdit = () => {
    editor.children = content;
    return qc.resetQueries({ queryKey: THREAD_CONTROL_QUERY_KEY });
  };
  
  const isReadOnly = !controlState?.state?.isContenteditable || !isOwner;
  const isTriggered: boolean = controlState?.state?.isContenteditable ? controlState.state.isContenteditable : false;
  
  return (
    <div className={`${isReadOnly ? '' : '!bg-shark-800'} px-4 w-full h-full flex !rounded-none`}>
      {isOwner && (
        <ContextMenu>
          <ContextMenuTrigger className="w-full">
            <Slate
              editor={editor}
              initialValue={content || initialValue}
              onValueChange={value => onChange(serializeNodes(value))}
              onChange={handleOnChange}
            >
              <Editable
                renderLeaf={props => <RenderLeaf {...props} children={props.children} />}
                renderElement={props => <RenderElement {...props} children={props.children} />}
                readOnly={isReadOnly}
                className="!outline-none"
                placeholder=" "
              />
            </Slate>
            {isTriggered && (
              <div className="flex my-4 items-center gap-2 w-full justify-end">
                <ThreadControlSave threadId={threadId} />
                <Button variant="negative" onClick={handleCancelEdit}>
                  <Typography>Отменить</Typography>
                </Button>
              </div>
            )}
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={handleContentEdit}>
              <div className="flex items-center gap-2">
                <PencilLine size={20} />
                <Typography>Редактировать</Typography>
              </div>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}
      {!isOwner && (
        <Slate
          editor={editor}
          initialValue={content || initialValue}
        >
          <Editable
            renderLeaf={props => <RenderLeaf {...props} children={props.children} />}
            renderElement={props => <RenderElement {...props} children={props.children} />}
            className="!outline-none"
            placeholder=" "
            readOnly={true}
          />
        </Slate>
      )}
    </div>
  );
};