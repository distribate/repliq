import { CustomEditor } from "./editor.tsx";
import { BaseEditor } from "slate";
import { Button } from "@repo/ui/src/components/button.tsx";
import { ReactNode } from "react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";

type EditorPanelProps = {
  editor: BaseEditor;
} & Partial<{
  withImage: ReactNode;
}>;

export const EditorPanel = ({ editor, withImage }: EditorPanelProps) => {
  return (
    <div className="flex bg-shark-900 w-fit rounded-md items-center">
      {withImage && (
        <>
          {withImage}
          <Separator orientation="vertical" />
        </>
      )}
      <Button
        title="Выделить жирным"
        type="button"
        className="w-12 hover:bg-shark-800"
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleBoldMark(editor);
        }}
      >
        <Typography textColor="gray">B</Typography>
      </Button>
      <Button
        title="Выделить курсивом"
        type="button"
        className="w-12 hover:bg-shark-800"
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleItalicMark(editor);
        }}
      >
        <Typography textColor="gray">I</Typography>
      </Button>
      <Button
        title="Выделить подчеркнутым"
        type="button"
        className="w-12 hover:bg-shark-800"
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleUnderlineMark(editor);
        }}
      >
        <Typography textColor="gray">U</Typography>
      </Button>
      <Button
        title="Выделить зачеркнутым"
        type="button"
        className="w-12 hover:bg-shark-800"
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleStrikeMark(editor);
        }}
      >
        <Typography textColor="gray">S</Typography>
      </Button>
      <Separator orientation="vertical" />
      <Button
        title="Выделить в виде кода"
        type="button"
        className="w-12 hover:bg-shark-800"
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleCodeBlock(editor);
        }}
      >
        <Typography textColor="gray">{"</>"}</Typography>
      </Button>
    </div>
  );
};
