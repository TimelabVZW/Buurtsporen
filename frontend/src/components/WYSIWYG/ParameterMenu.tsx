import { useState } from 'react'
import { ParameterMenuProps } from '../../interfaces'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ConditionalLoader from '../ConditionalLoader';
import TextAlign from '@tiptap/extension-text-align';

const ParameterMenu = ({keys, editor}: ParameterMenuProps) => {
    if (!editor) {
      return null
    }
  
    return (
        <div className='wysiwyg-menu--parameters'>
            {keys.map((key: string, index: number) => {
                return (
                    <button
                        id={key + index}
                        type='button'
                        onClick={() => editor.chain().focus().insertContent(`{${key}}`).run()}
                    >
                        {key}
                    </button>
                )
            })}
        </div>
    )
  }

  export default ParameterMenu;