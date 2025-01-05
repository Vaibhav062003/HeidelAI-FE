import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    const transporter = nodemailer.createTransport({
      host: 'mail.egeniestores.com',
      port: 465,
      secure: true,
      auth: {
        user: "support@egeniestores.com",
        pass: "%,86,elibIA",
      },
    });

    // Send mail
    await transporter.sendMail({
      from: 'support@egeniestores.com',
      to: 'rounaklongani@gmail.com',
      subject: 'Demo Request',
      text: `Name: ${name}\nEmail: ${email}`,
    });

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}