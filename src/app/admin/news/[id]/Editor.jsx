'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'

import 'prosemirror-view/style/prosemirror.css'
import styles from './Editor.module.css'

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '<p>Start typing…</p>',
    immediatelyRender: false,
  })

  if (!editor) return null

  return (
    <div className={styles['tiptap-editor']}>
      {/* Toolbar */}
      <div style={{ marginBottom: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => console.log(editor.getHTML())}>
          Debug HTML
        </button>

        {/* Headings */}
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>

        {/* Insert Table */}
        <button
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          Insert Table
        </button>

        {/* Table Controls */}
        <button onClick={() => editor.chain().focus().addColumnBefore().run()}>
          + Col Before
        </button>
        <button onClick={() => editor.chain().focus().addColumnAfter().run()}>
          + Col After
        </button>
        <button onClick={() => editor.chain().focus().deleteColumn().run()}>
          - Col
        </button>

        <button onClick={() => editor.chain().focus().addRowBefore().run()}>
          + Row Before
        </button>
        <button onClick={() => editor.chain().focus().addRowAfter().run()}>
          + Row After
        </button>
        <button onClick={() => editor.chain().focus().deleteRow().run()}>
          - Row
        </button>

        <button onClick={() => editor.chain().focus().deleteTable().run()}>
          Delete Table
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
