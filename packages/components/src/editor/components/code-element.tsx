export const CodeElement = ({ ...props }) => {
  return (
    <pre className="!bg-shark-600 rounded-md p-0.5" {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};