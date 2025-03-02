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
        className={`w-14 h-10 hover:bg-shark-700 ${CustomEditor.isBoldMarkActive(editor) && "bg-shark-700"}`}
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleBoldMark(editor);
        }}
      >
        <Typography textColor="gray" className="text-[20px]">B</Typography>
      </Button>
      <Button
        title="Выделить курсивом"
        type="button"
        className={`w-14 h-10 hover:bg-shark-700 ${CustomEditor.isItalicMarkActive(editor) && "bg-shark-700"}`}
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleItalicMark(editor);
        }}
      >
        <Typography textColor="gray" className="text-[20px]">I</Typography>
      </Button>
      <Button
        title="Выделить подчеркнутым"
        type="button"
        className={`w-14 h-10 hover:bg-shark-700 ${CustomEditor.isUnderlineMarkActive(editor) && "bg-shark-700"}`}
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleUnderlineMark(editor);
        }}
      >
        <Typography textColor="gray" className="text-[20px]">U</Typography>
      </Button>
      <Button
        title="Выделить зачеркнутым"
        type="button"
        className={`w-14 h-10 hover:bg-shark-700 ${CustomEditor.isStrikeMarkActive(editor) && "bg-shark-700"}`}
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleStrikeMark(editor);
        }}
      >
        <Typography textColor="gray" className="text-[20px]">S</Typography>
      </Button>
      <Separator orientation="vertical" />
      <Button
        title="Выделить в виде кода"
        type="button"
        className={`w-14 h-10 hover:bg-shark-700 ${CustomEditor.isCodeBlockActive(editor) && "bg-shark-700"}`}
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleCodeBlock(editor);
        }}
      >
        <Typography textColor="gray" className="text-[20px]">{"</>"}</Typography>
      </Button>
    </div>
  );
};
