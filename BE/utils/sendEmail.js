import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vasudhapatoliya502@gmail.com",
    pass: "mlta ztcb qmpl bovp",
  },
});

export function sendEmail({ email, otp }) {
  // console.log("🚀 ~ sendUpdateEmail ~ data:", newObject);

  const mailOptions = {
    from: "vasudhapatoliya502@gmail.com",
    to: email,
    subject: "otp",
    text: `your opt is ${otp}`,
  };

  return transporter.sendMail(mailOptions);
}
