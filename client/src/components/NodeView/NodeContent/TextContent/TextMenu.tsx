import React from 'react'
import { Editor } from '@tiptap/react'
import './TextContent.scss'

interface IEditorProps {
  editor: Editor | null
}

export const TextMenu = (props: IEditorProps) => {
  const { editor } = props
  if (!editor) {
    return null
  }

  // Functionality for a rich text editor!
  return (
    <div id="textMenu">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive('heading', { level: 1 })
            ? 'active-textEditorButton'
            : 'textEditorButton'
        }
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive('heading', { level: 2 })
            ? 'active-textEditorButton'
            : 'textEditorButton'
        }
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive('heading', { level: 3 })
            ? 'active-textEditorButton'
            : 'textEditorButton'
        }
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={
          editor.isActive('bold') ? 'active-textEditorButton' : 'textEditorButton'
        }
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={
          editor.isActive('code') ? 'active-textEditorButton' : 'textEditorButton'
        }
      >
        Code
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          editor.isActive('codeBlock') ? 'active-textEditorButton' : 'textEditorButton'
        }
      >
        Code Block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          editor.isActive('bulletList') ? 'active-textEditorButton' : 'textEditorButton'
        }
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          editor.isActive('italic') ? 'active-textEditorButton' : 'textEditorButton'
        }
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={
          editor.isActive('strike') ? 'active-textEditorButton' : 'textEditorButton'
        }
      >
        Strike
      </button>
    </div>
  )
}
