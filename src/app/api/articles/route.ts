import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSlug } from '@/lib/utils';

const articleSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  cover_image: z.string().url().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published_at: z.string().datetime().optional(),
  status: z.enum(['draft', 'published']).default('published'),
  overwrite: z.boolean().optional(), // if true, upsert on slug
});

async function supabaseFetch(path: string, init?: RequestInit) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase configuration missing');
  const headers: HeadersInit = {
    'Authorization': `Bearer ${key}`,
    'apikey': key,
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  };
  const res = await fetch(`${url}${path}`, { ...init, headers });
  return res;
}

async function slugExists(slug: string): Promise<boolean> {
  const res = await supabaseFetch(`/rest/v1/articles?slug=eq.${encodeURIComponent(slug)}&select=id`);
  if (!res.ok) return false;
  const rows = await res.json();
  return Array.isArray(rows) && rows.length > 0;
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let attempt = base;
  let n = 1;
  while (await slugExists(attempt)) {
    n += 1;
    attempt = `${base}-${n}`;
  }
  return attempt;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = articleSchema.parse(body);

    const baseSlug = createSlug(data.slug || data.title);
    const overwrite = Boolean(data.overwrite);

    const finalSlug = overwrite ? baseSlug : await ensureUniqueSlug(baseSlug);

    const article = {
      title: data.title,
      slug: finalSlug,
      content: data.content ?? null,
      excerpt: data.excerpt ?? null,
      cover_image: data.cover_image ?? null,
      author: data.author ?? null,
      tags: data.tags ?? null,
      published_at: data.published_at ?? new Date().toISOString(),
      status: data.status,
    };

    // Insert or upsert
    const query = overwrite ? '/rest/v1/articles?on_conflict=slug' : '/rest/v1/articles';
    const res = await supabaseFetch(query, {
      method: 'POST',
      headers: {
        Prefer: overwrite ? 'resolution=merge-duplicates,return=representation' : 'return=representation',
      },
      body: JSON.stringify(article),
    });

    if (!res.ok) {
      const text = await res.text();
      // If unique violation, surface a friendly message
      if (text.includes('duplicate key value') || text.includes('unique constraint')) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: `Supabase error: ${res.status} - ${text}` }, { status: 500 });
    }

    const [saved] = await res.json();

    return NextResponse.json({ success: true, article: saved }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: err.issues }, { status: 400 });
    }
    console.error('Article publish error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}
