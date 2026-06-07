import { Resend } from 'resend';

export async function POST(req) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { name, email } = await req.json();
    await resend.emails.send({
      from: 'Кадар <noreply@filipdimitrievski.com>',
      to: email,
      subject: 'You are now a verified director on Кадар',
      html: `
        <div style="font-family: Georgia, serif; background: #060605; color: #f0e8d0; padding: 40px; max-width: 560px;">
          <div style="font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #c9a84c; margin-bottom: 24px; font-family: sans-serif;">Кадар · Verified</div>
          <h1 style="font-size: 24px; font-weight: 400; color: #f0e8d0; margin: 0 0 16px;">Welcome, ${name}.</h1>
          <p style="font-size: 13px; color: #8a7f6a; line-height: 1.8; margin: 0 0 32px;">Your director account has been verified. You can now submit films to the platform.</p>
          <a href="https://kadar-six.vercel.app/directors/dashboard" style="background: #c9a84c; color: #060605; padding: 12px 28px; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; text-decoration: none; font-family: sans-serif; font-weight: 700;">Go to Dashboard</a>
        </div>
      `,
    });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}