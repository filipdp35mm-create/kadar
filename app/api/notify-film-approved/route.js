import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { name, email, title } = await request.json();

  await resend.emails.send({
    from: 'КАДАР <noreply@filipdimitrievski.com>',
    to: email,
    subject: `Your film has been approved — ${title}`,
    html: `
      <div style="background:#060605;padding:48px 40px;font-family:Georgia,serif;color:#f0e8d0;max-width:520px;margin:0 auto;">
        <div style="font-size:9px;letter-spacing:5px;color:#c9a84c;font-family:sans-serif;margin-bottom:32px;">КАДАР</div>
        <h1 style="font-size:20px;font-weight:400;margin:0 0 24px;color:#f0e8d0;">Your film has been approved.</h1>
        <p style="font-size:13px;color:#a09880;line-height:1.7;margin:0 0 12px;">
          Dear ${name},
        </p>
        <p style="font-size:13px;color:#a09880;line-height:1.7;margin:0 0 12px;">
          <span style="color:#f0e8d0;">${title}</span> has been reviewed and approved. It is now visible on your director dashboard.
        </p>
        <p style="font-size:13px;color:#a09880;line-height:1.7;margin:0 0 32px;">
          The film will go live on the platform once your payment is completed. You can manage this from your dashboard.
        </p>
        <div style="border-top:0.5px solid #1a1610;padding-top:24px;font-size:10px;color:#3a3020;font-family:sans-serif;letter-spacing:2px;">
          КАДАР · SHORT FILM PLATFORM
        </div>
      </div>
    `,
  });

  return Response.json({ ok: true });
}