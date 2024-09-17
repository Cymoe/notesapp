import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET() {
  console.log('Notes API: Fetching notes...');
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log(`Notes API: Fetched ${data.length} notes`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Notes API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch notes', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log('Notes API: Creating new note...');
  try {
    const { title, content } = await request.json();
    const { data, error } = await supabase
      .from('notes')
      .insert({ title, content })
      .select()
      .single();

    if (error) throw error;

    console.log('Notes API: Note created with ID:', data.id);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in Notes API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create note', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
