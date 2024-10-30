import { RenderElementProps } from 'slate-react';

export const DefaultElement = ({ ...props }: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
};

export const CodeElement = ({ ...props }: RenderElementProps) => {
  return (
    <pre className="bg-shark-700 rounded-md p-0.5 w-fit" {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};