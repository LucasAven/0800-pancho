/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import { createTransport, type SendMailOptions } from "nodemailer";
import type { MailData } from "types";
import NextCors from "utils/init-middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  await NextCors(req, res, {
    methods: ["POST", "OPTIONS"],
  });

  const beatSoldInfoMail: SendMailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    subject: "Beat vendido!",
  };

  if (req.method === "POST") {
    const { isContact, mailFields } = req.body as {
      isContact: boolean;
      mailFields: unknown;
    };

    if (!mailFields) {
      return res.status(400).json({ error: "Missing data" });
    }

    let mailOptions: SendMailOptions = {};

    if (!isContact) {
      const { beat, email, id, license, link, collector_id } =
        mailFields as MailData<typeof isContact>;
      mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Compra de Beat ${beat}`,
        text: `Gracias por comprar la licencia ${license} de: ${beat}!\n\nAquí tienes el link de descarga de los archivos:\n\n${link}\n\nTransaction ID: ${id}.\n\n\nPor cualquier duda o consulta, escribime a: ${
          process.env.NEXT_PUBLIC_CONTACT_EMAIL || ""
        }`,
      };

      // added beat sold info to the email that will be sent to the admin
      beatSoldInfoMail.text = `Un beat fue vendido! \n\n El beat vendido fue: ${beat} \n\n El comprador fue: ${email} \n\n La licencia comprada fue: ${license} \n\n El link de descarga  que se le envio es: ${link} \n\n El ID de la transacción es: ${id} \n\n El ID del comprador: ${collector_id}`;
    } else {
      const { email, name, subject, message } = mailFields as MailData<
        typeof isContact
      >;
      mailOptions = {
        from: email,
        to: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
        subject,
        text: `Mensaje de ${name}:\n\n${message}\n\nPara responderle escribile a: ${email}`,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      await transporter.sendMail(mailOptions);
      // beat was sold so send an email to the admin too
      if(!isContact){
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        await transporter.sendMail(beatSoldInfoMail);
      }
    } catch (error) {
      return res.status(500).json({
        error: `Error while sending the email: ${JSON.stringify(error)}`,
      });
    }
    return res.status(200).json({ message: "Email sent" });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
