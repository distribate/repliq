import nodemailer from "nodemailer"
import { NODEMAILER_HOST, NODEMAILER_PASSWORD, NODEMAILER_PORT, NODEMAILER_USER } from "../env";

const transporter = nodemailer.createTransport({
  host: "127.0.0.1",
  port: Number(NODEMAILER_PORT),
  secure: false, // STARTTLS
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASSWORD,
  },
});

export async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}) {
  const info = await transporter.sendMail({
    from: `"My App" <${NODEMAILER_USER}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  return info;
}