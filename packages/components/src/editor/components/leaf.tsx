export const Leaf = ({ ...props }) => {
  const leaf = props.leaf;

  const fontWeight = leaf.bold ? "bold" : "normal";
  const fontStyle = leaf.italic ? "italic" : "normal";
  const textDecoration = leaf.underline
    ? "underline"
    : leaf.strike
      ? "line-through"
      : "none";

  return (
    <span
      style={{ fontWeight, fontStyle, textDecoration }}
      {...props.attributes}
    >
      {props.children}
    </span>
  );
};
