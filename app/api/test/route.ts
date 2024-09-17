import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const database = client.db("notesdb");
    const notes = database.collection("notes");

    const count = await notes.countDocuments();

    return NextResponse.json({ message: "Connection successful", count });
  } catch (error) {
    console.error('Error in test route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect', 
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
