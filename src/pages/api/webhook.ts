import { payment } from "mercadopago";
import type { NextApiRequest, NextApiResponse } from "next";
import type { UpdateBeatError } from "types";
import { sendErrorEmail, updateBeats } from "utils";
import NextCors from "utils/init-middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["POST"],
  });

  if (req.method === "POST") {
    const { body } = req as {
      body: { data: { id: number }; action: string };
    };
    if (body.action === "payment.created") {
      try {
        const paymentData = await payment.get(body.data.id);
        await updateBeats(paymentData);
      } catch (err) {
        const { beatId, buyerEmail, collectorId, errorType, license } =
          err as UpdateBeatError;

        await sendErrorEmail({
          from: process.env.GMAIL_USER,
          to: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
          subject: "Error en la compra de un beat",
          text: `Error en la compra de: \n\n beatId: ${beatId}
          \n\n error: ${errorType}
          \n\n tipo de licencia: ${license}
          \n\n email del comprador: ${buyerEmail}
          \n\n id del comprador: ${collectorId}
          \n\n\n Si no podes ver la transaccion en Mercado Pago, o tenes algun otro inconveniente, contactame.`,
        });
      }
    }
    return res.status(200);
  } else {
    return res.status(405).send({ message: "Method not allowed." });
  }
}
