import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { sub } = await req.json();
    const now = new Date().toISOString();

    // Country lookup
    let country_id = null;
    if (sub.country) {
      const { data: countryRow } = await supabaseAdmin
        .from('countries').select('id').eq('code', sub.country).maybeSingle();
      country_id = countryRow?.id ?? null;
    }

    // Ensure director row exists
    const { data: existingDir } = await supabaseAdmin
      .from('directors').select('id').eq('id', sub.director_id).maybeSingle();
    if (!existingDir) {
      const { data: dirProf } = await supabaseAdmin
        .from('director_profiles').select('name, bio').eq('id', sub.director_id).single();
      await supabaseAdmin.from('directors').insert({
        id: sub.director_id, name: dirProf?.name || 'Unknown', bio: dirProf?.bio || null,
      });
    }

    // Insert film
    const { data: film, error: filmErr } = await supabaseAdmin
      .from('films')
      .insert({
        title: sub.title,
        type: sub.type === 'short_film' ? 'Short Film' : 'Music Video',
        year: sub.year,
        director_id: sub.director_id,
        country_id,
        status: 'unreleased',
        synopsis: sub.description || null,
        festivals: sub.festival_history || null,
        poster_file: sub.poster_link || null,
        created_at: now,
      }).select().single();

    if (filmErr) return Response.json({ ok: false, error: filmErr.message }, { status: 500 });

    // Insert director_films
    await supabaseAdmin.from('director_films').insert({
      director_id: sub.director_id,
      film_id: film.id,
      listed_at: now,
      payment_status: 'pending',
    });

    // Mark submission approved
    await supabaseAdmin.from('film_submissions')
      .update({ status: 'approved', reviewed_at: now })
      .eq('id', sub.id);

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}