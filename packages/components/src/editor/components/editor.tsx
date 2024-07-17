import { BaseEditor, Editor, Transforms } from 'slate';

export const CustomEditor = {
  isItalicMarkActive(editor: BaseEditor) {
    const marks = Editor.marks(editor);
    // @ts-ignore
    return marks ? marks.italic === true : false;
  },
  
  isBoldMarkActive(editor: BaseEditor) {
    const marks = Editor.marks(editor);
    // @ts-ignore
    return marks ? marks.bold === true : false;
  },
  
  isCodeBlockActive(editor: BaseEditor) {
    // @ts-ignore
    const [ match ] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => n.type === 'code',
    });
    
    return !!match;
  },
  
  toggleItalicMark(editor: BaseEditor) {
    const isActive = CustomEditor.isItalicMarkActive(editor);
    
    if (isActive) {
      Editor.removeMark(editor, 'italic');
    } else {
      Editor.addMark(editor, 'italic', true);
    }
  },
  
  toggleBoldMark(editor: BaseEditor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    
    if (isActive) {
      Editor.removeMark(editor, 'bold');
    } else {
      Editor.addMark(editor, 'bold', true);
    }
  },
  
  toggleCodeBlock(editor: BaseEditor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    
    Transforms.setNodes(
      editor,
      {
        // @ts-ignore
        type: isActive ? null : 'code',
      },
      {
        // @ts-ignore
        match: n => Editor.isBlock(editor, n),
      },
    );
  },
};