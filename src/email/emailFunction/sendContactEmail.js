import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import { transporter } from "../../config/transporter.js";

// compile helper
const compileTemplate = (fileName, data) => {
  const filePath = path.join(
    process.cwd(),
    "src/email/emailTemplate",
    fileName
  );

  const source = fs.readFileSync(filePath, "utf-8");
  const template = Handlebars.compile(source);

  return template(data);
};

export const sendContactEmail = async ({ name, email, message }) => {
  // admin email
  const adminHtml = compileTemplate("adminNotify.hbs", {
    name,
    email,
    message,
  });

  await transporter.sendMail({
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New Contact from ${name}`,
    html: adminHtml,
  });

  // auto reply
  const autoReplyHtml = compileTemplate("autoReply.hbs", {
    name,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Thanks for your mail!",
    html: autoReplyHtml,
  });
};
