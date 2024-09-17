import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link';
import styles from './Notes.module.css';
import CreateNote from './CreateNote';


async function getNotes() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: notes, error } = await supabase
    .from('notes')
    .select('id, title, content, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notes:', error)
    return []
  }

  return notes
}

export const revalidate = 10;

export default async function NotesPage() {
  const notes = await getNotes();

  return(
    <div>
      <h1>Notes</h1>
      <div className={styles.grid}>
        {notes?.map((note) => {
          return <Note key={note.id} note={note} />;
        })}
      </div>
      <CreateNote />
    </div>
  );
}

function Note({ note }: any) {
  const { id, title, content, created_at } = note || {};

  return (
    <Link href={`/notes/${id}`}>
      <div className={styles.note}>
        <h2>{title}</h2>
        <h5>{content}</h5>
        <p>{new Date(created_at).toLocaleString()}</p>
      </div>
    </Link>
  );
}
