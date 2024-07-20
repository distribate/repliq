'use client';

import { useCallback, useMemo } from 'react';
import { Editable, Slate, withReact } from 'slate-react';
import { createEditor } from 'slate';
import { Leaf } from '../../../../editor/components/leaf.tsx';
import { DefaultElement } from '../../../../editor/components/default-element.tsx';

type ThreadContentProps = {
  content: any
}

const initialValue = [
  {
    type: 'paragraph', children: [ {
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
  
  const renderElement = useCallback(({ ...props }) => {
    switch(props.element.type) {
      default:
        return <DefaultElement {...props} />;
    }
  }, []);
  
  const renderLeaf = useCallback(({ ...props }) => {
    return <Leaf {...props} />;
  }, []);
  
  return (
    <Slate editor={editor} initialValue={content || initialValue}>
      <Editable
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        readOnly
        placeholder="Something"
      />
    </Slate>
  );
};