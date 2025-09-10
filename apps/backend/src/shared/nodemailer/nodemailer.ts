import nodemailer from "nodemailer"
import { NODEMAILER_HOST, NODEMAILER_PASSWORD, NODEMAILER_PORT, NODEMAILER_USER } from "../env";

const transporter = nodemailer.createTransport({
  host: NODEMAILER_HOST,
  port: Number(NODEMAILER_PORT),
  secure: false, // true for port 465, false for other ports
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASSWORD,
  },
});

async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}