import type { NextApiRequest, NextApiResponse } from "next";
import { configure, preferences } from "mercadopago";
import type {
  CreatePreferencePayload,
  PreferenceBackUrl,
} from "mercadopago/models/preferences/create-payload.model";
import type { CheckoutBody, MPExternalReference } from "types";
import NextCors from "utils/init-middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET"],
  });

  // Here is where we configure our session, setting the access token provided by MP
  configure({
    access_token: process.env.MP_ACCESS_TOKEN || "",
  });

  // This is just boilerplate data, but really you'll need to catch the important data that MP asks for below
  const { beat, license, prices, buyerEmail } = req.body as CheckoutBody;

  // Here we create the "Preference", this is the config for the payment
  const preference: CreatePreferencePayload = {
    // This is always true * REQUIRED
    binary_mode: true,
    // The data of the item that the user has to pay for * REQUIRED
    items: [
      {
        id: beat.beatId,
        title: `${beat.title} licencia ${license}`,
        description: `Compra de la licencia ${license} del beat: ${beat.title}`,
        picture_url: beat.image_url,
        quantity: 1,
        currency_id: "ARS",
        unit_price: prices[license],
      },
    ],
    external_reference: JSON.stringify({
      beatId: beat.beatId,
      email: buyerEmail,
      license: license,
    } as MPExternalReference),
    payment_methods: {
      installments: 3,
      excluded_payment_methods: [
        {
          id: "pagofacil",
        },
        {
          id: "rapipago",
        },
      ],
      excluded_payment_types: [
        {
          id: "ticket",
        },
      ],
    },
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/post-purchase?succeed=true&beatId=${beat.beatId}`,
      failure: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/post-purchase?succeed=false`,
    } as PreferenceBackUrl,
    notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/webhook`,
    auto_return: "approved",
  };

  // Here we config the preference, it's like send it to MP and then its API returns a response object.
  // We just need the id from it, so we set the response to { global: response.body.id }.
  // This will send an object literal where we can access the ID for our frontend button
  preferences
    .create(preference)
    .then(({ body }) =>
      res
        .status(200)
        .json({ checkoutLink: (body as { init_point: string }).init_point })
    )
    .catch((error) =>
      // In an error appears, we'll send the error.
      res.status(500).json({ error: (error as Error).message })
    );
}
