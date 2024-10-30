import { useCallback } from 'react';
import { CodeElement, DefaultElement } from './block-elements.tsx';
import { RenderElementProps } from 'slate-react';

export const RenderElement = ({
  ...props
}: RenderElementProps) => {
  switch(props.element.type) {
    case 'code':
      return <CodeElement {...props} children={props.children} />;
    default:
      return <DefaultElement {...props} children={props.children} />;
  }
}