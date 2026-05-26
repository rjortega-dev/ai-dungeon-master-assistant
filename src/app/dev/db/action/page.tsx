import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

type Comment = {
  id: number;
  comment: string;
};

export default async function ActionPage() {
  async function createComment(formData: FormData) {
    'use server';

    const comment = formData.get('comment') as string;

    await sql`
      INSERT INTO comments (comment)
      VALUES (${comment})
    `;

    revalidatePath('/action');
  }

  async function getComments(): Promise<Comment[]> {
  await sql`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      comment TEXT
    )
  `;

  const comments = (await sql`
    SELECT * FROM comments
  `) as Comment[];

  return comments;
}

  const comments = await getComments();

  return (
    <div>
      <h2>Server Action Example</h2>

      <form action={createComment}>
        <input
          type="text"
          name="comment"
          placeholder="Add a comment"
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Comments:</h3>

      <ul>
        {comments.map((c) => (
          <li key={c.id}>{c.comment}</li>
        ))}
      </ul>
    </div>
  );
}