import Mailgun from "mailgun.js";
import formData from "form-data";
import { Email } from "../types";

const mailgunApiKey = process.env.MAILGUN_API_KEY as string;
const mailgunDomain = process.env.MAILGUN_DOMAIN as string;

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "fidia-assessment", key: mailgunApiKey });

async function sendEmail(data: Email): Promise<boolean> {
  try {
    const result = await mg.messages.create(mailgunDomain, data);
    console.log(result);

    return true;
  } catch (err) {
    console.log(err);
  }

  return false;
}

export { sendEmail };
