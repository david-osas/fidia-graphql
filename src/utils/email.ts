import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const mailerUsername = process.env.NODEMAILER_USERNAME as string;
const mailerPassword = process.env.NODEMAILER_PASSWORD as string;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailerUsername,
    pass: mailerPassword,
  },
});

async function sendEmail(data: Mail.Options): Promise<boolean> {
  try {
    const info = await transporter.sendMail(data);
    console.log(info);

    return true;
  } catch (err) {
    console.log(err);
  }

  return false;
}

export { sendEmail };
