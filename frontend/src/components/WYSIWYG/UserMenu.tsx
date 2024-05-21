import { useCurrentEditor } from '@tiptap/react';
import { useCallback } from 'react';

import { 
    AlignCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BoldIcon,
    Heading1Icon,
    Heading2Icon,
    ItalicIcon,
    LinkIcon,
    ListIcon,
    ListOrderedIcon,
    QuoteIcon,
    RedoIcon,
    UnderlineIcon,
    UndoIcon,
    UnlinkIcon
} from 'lucide-react';

const UserMenu = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  const setLink = useCallback(() => {
      const previousUrl = editor.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)
  
      // cancelled
      if (url === null) {
        return
      }
  
      // empty
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink()
          .run()
  
        return
      }
  
      // update link
      editor.chain().focus().extendMarkRange('link').setLink({ href: url })
        .run()
    }, [editor])

  return (
    <>
      <div className='wysiwyg-menu--user'>
        <div className='wysiwyg--mainbar wysiwyg--sub'>
            <div className='wysiwyg--sub wysiwyg--typography'>
                <div className='wysiwyg--sub wysiwyg--lettertypo'>
                    <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={
                        !editor.can()
                        .chain()
                        .focus()
                        .toggleBold()
                        .run()
                    }
                    className={editor.isActive('bold') ? 'is-active' : ''}
                    >
                        <BoldIcon/>
                    </button>
                    <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can()
                        .chain()
                        .focus()
                        .toggleItalic()
                        .run()
                    }
                    className={editor.isActive('italic') ? 'is-active' : ''}
                    >
                        <ItalicIcon/>
                    </button>
                    <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    disabled={
                        !editor.can()
                        .chain()
                        .focus()
                        .toggleUnderline()
                        .run()
                    }
                    className={editor.isActive('underline') ? 'is-active' : ''}
                    >
                        <UnderlineIcon/>
                    </button>
                </div>
                <div className='wysiwyg--sub wysiwyg--align'>
                    <button
                    type='button'
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
                    >
                        <AlignLeftIcon/>
                    </button>
                    <button
                    type='button'
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
                    >
                        <AlignCenterIcon/>
                    </button>
                    <button
                    type='button'
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
                    >
                        <AlignRightIcon/>
                    </button>
                </div>
                <div className='wysiwyg--sub wysiwyg--structure'>
                    <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                    >
                        <Heading1Icon/>
                    </button>
                    <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                    >
                        <Heading2Icon/>
                    </button>
                    <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                    >
                        <ListIcon/>
                    </button>
                    <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'is-active' : ''}
                    >
                        <ListOrderedIcon/>
                    </button>
                    <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'is-active' : ''}
                    >
                        <QuoteIcon/>
                    </button>
                    <button
                    type='button'
                    onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}
                    >
                        <LinkIcon/>
                    </button>
                    <button
                    type='button'
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    disabled={!editor.isActive('link')}
                    >
                        <UnlinkIcon/>
                    </button>
                </div>
                <div className='wysiwyg--sub wysiwyg--unredo'>
                    <button
                    type='button'
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={
                        !editor.can()
                        .chain()
                        .focus()
                        .undo()
                        .run()
                    }
                    >
                        <UndoIcon/>
                    </button>
                    <button
                    type='button'
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={
                        !editor.can()
                        .chain()
                        .focus()
                        .redo()
                        .run()
                    }
                    >
                        <RedoIcon/>
                    </button>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

  export default UserMenu;