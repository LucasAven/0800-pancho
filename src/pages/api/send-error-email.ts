/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from "env/server.mjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { createTransport, type SendMailOptions } from "nodemailer";
import NextCors from "utils/init-middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  await NextCors(req, res, {
    methods: ["POST"],
  });

  if (req.method === "POST") {
    const { mailFields } = req.body as {
      mailFields: SendMailOptions;
    };

    if (!mailFields) {
      return res.status(400).json({ error: "Missing data" });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: env.GMAIL_USER,
        pass: env.GMAIL_PASS,
      },
    });

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      await transporter.sendMail(mailFields);
    } catch (error) {
      return res.status(500).json({
        error: `Error while sending the email: ${JSON.stringify(error)}`,
      });
    }
    return res.status(200);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
