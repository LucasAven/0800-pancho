import Cors from "cors";
import initMiddleware from "../../lib/init-middleware";

import {
  configureMercadoPagoSDK,
  createPaymentLink,
} from "../../lib/mercadopago-service";

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
  })
);

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method === "POST") {
    configureMercadoPagoSDK();

    const result = await createPaymentLink(req.body);

    res.json({ ok: true, link: result.body.init_point || "error" });
  } else {
    res.json({ ok: false, message: "Metodo no valido para el endpoint" });
  }
}
