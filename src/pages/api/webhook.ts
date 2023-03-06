import { payment } from "mercadopago";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "server/db";
import { UpdateBeatError } from "types";
import type { MPExternalReference, MPPaymentDataResponse } from "types";
import { revalidateBeatPage, sendEmail, sendErrorEmail } from "utils";
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

        const { external_reference, status, status_detail, id, collector_id } =
          paymentData.body as MPPaymentDataResponse;
        const { beatId, email, license } = JSON.parse(
          external_reference
        ) as MPExternalReference;

        if (status !== "approved" || status_detail !== "accredited")
          throw new UpdateBeatError({
            errorType: "Payment not approved",
            buyerEmail: email,
            beatId,
            transactionId: id,
            collectorId: collector_id,
            license,
          });
        const beatSold = await prisma.beat.update({
          where: { beatId },
          data: {
            sold: true,
          },
        });
        if (!beatSold)
          throw new UpdateBeatError({
            errorType: "Beat not found",
            buyerEmail: email,
            beatId,
            transactionId: id,
            collectorId: collector_id,
            license,
          });
        const beatFiles = await prisma.file.findUnique({
          where: { beatId },
          select: {
            baseFileUrl: license === "basic",
            editableFileUrl: license === "custom",
          },
        });
        if (!beatFiles?.baseFileUrl && !beatFiles?.editableFileUrl)
          throw new UpdateBeatError({
            errorType: "Beat files not found",
            buyerEmail: email,
            beatId,
            transactionId: id,
            collectorId: collector_id,
            license,
          });
        await revalidateBeatPage(beatId);
        await sendEmail(false, {
          id: id.toString(),
          collector_id,
          email,
          beat: beatSold.title,
          license,
          link: beatFiles?.baseFileUrl || beatFiles?.editableFileUrl,
        });

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
