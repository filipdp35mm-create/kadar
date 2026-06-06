import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { fullName, company, country, phone, imdb, previousWork, note, email } = await req.json();
    await resend.emails.send({
      from: 'Кадар <noreply@kadar-six.vercel.app>',
      to: 'office@filipdimitrievski.com',
      subject: `Director Verification Request — ${fullName}`,
      html: `
        <div style="font-family: Georgia, serif; background: #060605; color: #f0e8d0; padding: 40px; max-width: 560px;">
          <div style="font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #c9a84c; margin-bottom: 24px; font-family: sans-serif;">Кадар · Verification Request</div>
          <h1 style="font-size: 24px; font-weight: 400; color: #f0e8d0; margin: 0 0 24px;">${fullName}</h1>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #5a5040; font-family: sans-serif; width: 160px;">Email</td><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 13px; color: #d0c8b0;">${email}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #5a5040; font-family: sans-serif;">Country</td><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 13px; color: #d0c8b0;">${country}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #5a5040; font-family: sans-serif;">Company</td><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 13px; color: #d0c8b0;">${company || '—'}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #5a5040; font-family: sans-serif;">Phone</td><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 13px; color: #d0c8b0;">${phone || '—'}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #5a5040; font-family: sans-serif;">IMDb</td><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 13px; color: #d0c8b0;">${imdb ? `<a href="${imdb}" style="color:#c9a84c">${imdb}</a>` : '—'}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #5a5040; font-family: sans-serif;">Previous Work</td><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 13px; color: #d0c8b0;">${previousWork || '—'}</td></tr>
            <tr><td style="padding: 10px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #5a5040; font-family: sans-serif;">Note</td><td style="padding: 10px 0; font-size: 13px; color: #d0c8b0;">${note || '—'}</td></tr>
          </table>
          <div style="margin-top: 32px; padding-top: 20px; border-top: 0.5px solid #1a1610; font-size: 10px; color: #3a3020; font-family: sans-serif;">
            To approve, update verification_status to 'verified' in Supabase director_profiles for this user.
          </div>
        </div>
      `,
    });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false }, { status: 500 });
  }
}