import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { AppError } from './app-error.js';

const transporter =
  env.MAIL_MODE === 'smtp' && env.SMTP_HOST
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth:
          env.SMTP_USER && env.SMTP_PASSWORD
            ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
            : undefined
      })
    : null;

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  if (!transporter) {
    if (env.NODE_ENV === 'production') {
      throw new AppError(503, 'Email delivery is not configured.');
    }
    console.info('[EchoAsk local verification] ' + email + ' code: ' + code);
    return;
  }

  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: email,
    subject: 'Your EchoAsk verification code',
    text: 'Your EchoAsk verification code is ' + code + '. It expires in 10 minutes.',
    html:
      '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#28233b">' +
      '<h1 style="color:#6c5ce7">Verify your EchoAsk account</h1>' +
      '<p>Enter this code to finish creating your account:</p>' +
      '<p style="font-size:28px;font-weight:700;letter-spacing:8px">' +
      code +
      '</p><p>This code expires in 10 minutes.</p></div>'
  });
}

