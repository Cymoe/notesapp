import { createClient } from '@/utils/supabase/client'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import styles from '../Notes.module.css'

export const revalidate = 60 // Revalidate every 60 seconds

async function getNote(noteId: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: note, error } = await supabase
    .from('notes')
    .select('id, title, content, created_at')
    .eq('id', noteId)
    .single()

  if (error) {
    console.error('Error fetching note:', error)
    return null
  }

  return note
}

export async function generateStaticParams() {
  const supabase = createClient()
  const { data: notes } = await supabase.from('notes').select('id').limit(20)
  
  return notes?.map(({ id }) => ({
    id: id.toString(),
  })) || []
}

export default async function NotePage({ params }: { params: { id: string } }) {
  const note = await getNote(params.id)

  if (!note) {
    return <div>Note not found</div>
  }

  return (
    <div>
      <h1>notes/{note.id}</h1>
      <div className={styles.note}>
        <h3>{note.title}</h3>
        <h5>{note.content}</h5>
        <p>{new Date(note.created_at).toLocaleString()}</p>
      </div>
      <p>Last updated: {new Date().toLocaleString()}</p>
    </div>
  )
}
