import { Resend } from 'resend';

export async function POST(req) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { directorName, directorEmail, filmTitle, filmType, transferLink } = await req.json();
    await resend.emails.send({
      from: 'Кадар <noreply@filipdimitrievski.com>',
      to: 'office@filipdimitrievski.com',
      subject: `New Film Submission — ${filmTitle}`,
      html: `
        <div style="font-family: Georgia, serif; background: #060605; color: #f0e8d0; padding: 40px; max-width: 560px;">
          <div style="font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #c9a84c; margin-bottom: 24px; font-family: sans-serif;">Кадар · Film Submission</div>
          <h1 style="font-size: 24px; font-weight: 400; color: #f0e8d0; margin: 0 0 24px;">${filmTitle}</h1>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #5a5040; font-family: sans-serif; width: 160px;">Director</td><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 13px; color: #d0c8b0;">${directorName}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #5a5040; font-family: sans-serif;">Email</td><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 13px; color: #d0c8b0;">${directorEmail}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #5a5040; font-family: sans-serif;">Type</td><td style="padding: 10px 0; border-bottom: 0.5px solid #1a1610; font-size: 13px; color: #d0c8b0;">${filmType === 'short_film' ? 'Short Film' : 'Music Video'}</td></tr>
            <tr><td style="padding: 10px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #5a5040; font-family: sans-serif;">Transfer Link</td><td style="padding: 10px 0; font-size: 13px; color: #d0c8b0;"><a href="${transferLink}" style="color:#c9a84c">${transferLink}</a></td></tr>
          </table>
        </div>
      `,
    });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}