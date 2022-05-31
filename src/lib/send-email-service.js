import nodemailer from "nodemailer";

export const sendEmail = (mailData, isContact = false) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.gmailUser,
      pass: process.env.gmailPass,
    },
  });
  let mailOptions = {};
  if (!isContact) {
    const { email, beat, id, link, license } = mailData;
    mailOptions = {
      from: process.env.gmailUser,
      to: email,
      subject: `Compra de Beat ${beat}`,
      text: `Gracias por comprar la licencia ${license} de: ${beat}!\n\nAquí tienes el link de descarga de los archivos:\n\n${link}\n\nTransaction ID: ${id}.\n\n\nPor cualquier duda o consulta, escribime a: ${process.env.gmailUser}`,
    };
  } else {
    const { email, name, subject, message } = mailData;
    mailOptions = {
      from: email,
      to: process.env.gmailUser,
      subject: subject,
      text: `Mensaje de ${name}:\n\n${message}\n\nPara responderle escribile a: ${email}`,
    };
  }

  const sendMailPromise = () => {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        return error ? reject(error) : resolve(info);
      });
    });
  };

  return sendMailPromise();
};
