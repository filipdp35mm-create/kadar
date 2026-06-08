import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { emails } = await request.json();

  await Promise.all(emails.map(email =>
    resend.emails.send({
      from: 'КАДАР <noreply@filipdimitrievski.com>',
      to: email,
      subject: 'Кадар is now live.',
      html: `
        <div style="background:#060605;padding:48px 40px;font-family:Georgia,serif;color:#f0e8d0;max-width:520px;margin:0 auto;">
          <div style="font-size:9px;letter-spacing:5px;color:#c9a84c;font-family:sans-serif;margin-bottom:32px;">КАДАР</div>
          <h1 style="font-size:22px;font-weight:400;margin:0 0 24px;">The platform is live.</h1>
          <p style="font-size:13px;color:#a09880;line-height:1.7;margin:0 0 32px;">
            Balkan short cinema and music videos — curated, rated, and archived. You're among the first to see it.
          </p>
          <a href="https://kadar-six.vercel.app" style="background:#c9a84c;color:#060605;padding:12px 28px;font-size:9px;letter-spacing:4px;text-transform:uppercase;font-family:sans-serif;font-weight:700;text-decoration:none;">
            Enter Кадар
          </a>
          <div style="border-top:0.5px solid #1a1610;padding-top:24px;margin-top:40px;font-size:10px;color:#3a3020;font-family:sans-serif;letter-spacing:2px;">
            КАДАР · SHORT FILM PLATFORM
          </div>
        </div>
      `,
    })
  ));

  return Response.json({ ok: true });
}