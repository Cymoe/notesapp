'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import styles from './Notes.module.css'
import { useRouter } from 'next/navigation'

export default function CreateNote() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    const { data, error } = await supabase.from('notes').insert({ title, content }).select()
    if (error) {
      console.error('Error creating note:', error)
    } else if (data) {
      console.log('Note created:', data)
      setTitle('')
      setContent('')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.createNoteForm}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Note content"
        required
      />
      <button type="submit">Add Note</button>
    </form>
  )
}
