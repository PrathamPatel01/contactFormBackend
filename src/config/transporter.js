// import nodemailer from "nodemailer";

// export const transporter = (emailUser, emailPass) => {
//   return nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: emailUser,
//       pass: emailPass,
//     },
//   });
// };

import nodemailer from "nodemailer";

console.log("SMTP DEBUG:", {
  user: process.env.EMAIL_USER,
  passLength: process.env.EMAIL_PASS?.length,
});

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

