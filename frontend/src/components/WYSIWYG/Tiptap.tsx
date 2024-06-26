import { TiptapProps } from '../../interfaces';
import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';

import '../../sass/components/wysiwyg.scss';
  
const extensions = [
  Color.configure({}),
  TextStyle.configure({}),
  Underline.configure({}),
  Typography.configure({}),
  Link.configure({
    protocols: ['mailto'],
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

const Tiptap = ({setInput, MenuBar}: TiptapProps) => {
    return (
      <div className='wysiwyg-container'>
        <EditorProvider slotBefore={MenuBar} extensions={extensions} onBlur={({editor}) => {
              // Update the test state with the current HTML content of the editor
              setInput(editor ? editor.getHTML() : '');
            }}> </EditorProvider>
      </div>
    );
  };

export default Tiptap