import React from 'react';
import { CustomEditor } from '../components/editor.tsx';
import { BaseEditor } from 'slate';

type HandleEventKeydown = {
  editor: BaseEditor;
  event: React.KeyboardEvent<HTMLDivElement>
}

export const handleEventKeyDown = ({
  event, editor
}: HandleEventKeydown) => {
  if (!event.ctrlKey) return;
  
  switch(event.key) {
    case '`': {
      event.preventDefault();
      CustomEditor.toggleCodeBlock(editor);
      break;
    }
    
    case 'i': {
      event.preventDefault();
      CustomEditor.toggleItalicMark(editor);
      break;
    }
    
    case 's': {
      event.preventDefault();
      CustomEditor.toggleStrikeMark(editor);
      break;
    }
    
    case 'u': {
      event.preventDefault();
      CustomEditor.toggleUnderlineMark(editor);
      break;
    }
    
    case 'b': {
      event.preventDefault();
      CustomEditor.toggleBoldMark(editor);
      break;
    }
  }
};