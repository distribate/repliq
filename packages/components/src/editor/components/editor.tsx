import { BaseEditor, Editor, Transforms, Element } from 'slate';

export const CustomEditor = {
  isItalicMarkActive(editor: BaseEditor) {
    const marks = Editor.marks(editor);
    return marks ? marks.italic === true : false;
  },
  
  isBoldMarkActive(editor: BaseEditor) {
    const marks = Editor.marks(editor);
    return marks ? marks.bold === true : false;
  },
  
  isUnderlineMarkActive(editor: BaseEditor) {
    const marks = Editor.marks(editor);
    return marks ? marks.underline === true : false;
  },
  
  isStrikeMarkActive(editor: BaseEditor) {
    const marks = Editor.marks(editor);
    return marks ? marks.strike === true : false;
  },
  
  isCodeBlockActive(editor: BaseEditor) {
    const [ match ] = Editor.nodes(editor, {
      match: n => n.type === 'code',
    });
    
    return !!match;
  },
  
  toggleItalicMark(editor: BaseEditor) {
    const isActive = this.isItalicMarkActive(editor);
    
    if (isActive) {
      Editor.removeMark(editor, 'italic');
    } else {
      Editor.addMark(editor, 'italic', true);
    }
  },
  
  toggleBoldMark(editor: BaseEditor) {
    const isActive = this.isBoldMarkActive(editor);
    
    if (isActive) {
      Editor.removeMark(editor, 'bold');
    } else {
      Editor.addMark(editor, 'bold', true);
    }
  },
  
  toggleUnderlineMark(editor: BaseEditor) {
    const isActive = this.isUnderlineMarkActive(editor);
    
    if (isActive) {
      Editor.removeMark(editor, 'underline');
    } else {
      Editor.addMark(editor, 'underline', true);
    }
  },
  
  toggleStrikeMark(editor: BaseEditor) {
    const isActive = this.isStrikeMarkActive(editor);
    
    if (isActive) {
      Editor.removeMark(editor, 'strike');
    } else {
      Editor.addMark(editor, 'strike', true);
    }
  },
  
  toggleCodeBlock(editor: BaseEditor) {
    const isActive = this.isCodeBlockActive(editor)
    
    Transforms.setNodes(
      editor,
      { type: isActive ? 'paragraph' : 'code', },
      {
        match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      },
    );
  },
};