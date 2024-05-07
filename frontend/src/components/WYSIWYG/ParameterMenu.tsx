import { ParameterMenuProps } from '../../interfaces'

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