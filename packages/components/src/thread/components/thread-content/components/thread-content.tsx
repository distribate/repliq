'use client';

import { useMemo } from 'react';
import { Editable, Slate, withReact } from 'slate-react';
import { createEditor } from 'slate';
import { RenderElement } from '#editor/components/render-element.tsx';
import { RenderLeaf } from '#editor/components/render-leaf.tsx';

type ThreadContentProps = {
  content: any
}

const initialValue = [
  {
    type: 'paragraph',
    children: [ {
      text: 'Произошла ошибка при загрузке контента!',
    } ],
  },
];

export const ThreadContent = ({
  content,
}: ThreadContentProps) => {
  const editor = useMemo(() => withReact(
    createEditor()), [],
  );
  
  return (
    <Slate editor={editor} initialValue={content || initialValue}>
      <Editable
        renderLeaf={props => <RenderLeaf {...props} children={props.children}/>}
        renderElement={props => <RenderElement {...props} children={props.children}/>}
        readOnly
        placeholder="Something"
      />
    </Slate>
  );
};