import Cors from "cors";
import { sendEmail } from "lib/send-email-service";
import initMiddleware from "../../lib/init-middleware";

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
  })
);

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method === "POST") {
    const mailData = {
      name: req.body.name,
      subject: req.body.subject,
      email: req.body.email,
      message: req.body.message,
    };
    const result = await sendEmail(mailData, true);

    res.json({ ok: true });
  } else {
    res.json({ ok: false, message: "Metodo no valido para el endpoint" });
  }
}
