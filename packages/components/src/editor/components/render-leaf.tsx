import { useCallback } from "react";
import { Leaf } from "./leaf.tsx";
import { RenderLeafProps } from "slate-react";

export const RenderLeaf = ({ ...props }: RenderLeafProps) => {
  return <Leaf {...props} />;
};
