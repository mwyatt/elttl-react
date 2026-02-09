'use client'

import { EditorContent } from '@tiptap/react'

import 'prosemirror-view/style/prosemirror.css'
import styles from './Editor.module.css'

export default function Editor ({ editor }) {
  if (!editor) return null

  return (
    <div className={styles['tiptap-editor']}>
      {/* Toolbar */}
      <div className={styles['tiptap-toolbar']}>

        {/* Font Style */}
        {/* Bold */}
        <span onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </span>
        {/* Italic */}
        <span onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </span>
        {/* Underline */}
        <span onClick={() => editor.chain().focus().toggleUnderline().run()}>
          Underline
        </span>

        {/* Headings */}
        <span onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </span>
        <span onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
          H4
        </span>

        {/* Insert Table */}
        <span
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          Insert Table
        </span>

        {/* Table Controls */}
        <span onClick={() => editor.chain().focus().addColumnBefore().run()}>
          + Col Before
        </span>
        <span onClick={() => editor.chain().focus().addColumnAfter().run()}>
          + Col After
        </span>
        <span onClick={() => editor.chain().focus().deleteColumn().run()}>
          - Col
        </span>

        <span onClick={() => editor.chain().focus().addRowBefore().run()}>
          + Row Before
        </span>
        <span onClick={() => editor.chain().focus().addRowAfter().run()}>
          + Row After
        </span>
        <span onClick={() => editor.chain().focus().deleteRow().run()}>
          - Row
        </span>

        <span onClick={() => editor.chain().focus().deleteTable().run()}>
          Delete Table
        </span>
      </div>

      {/* Editor */}
      <EditorContent className={styles['tiptap-editor-content']} editor={editor} />
    </div>
  )
}
