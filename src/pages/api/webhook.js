import Cors from "cors";
import { updateBeats } from "lib/beats-service";
import initMiddleware from "../../lib/init-middleware";

const cors = initMiddleware(
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST", "OPTIONS"],
  })
);

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method === "POST") {
    if (req.body.action === "payment.created") {
      const paymentId = req.body.data.id;
      await updateBeats(paymentId);
      return res.status(200).json({
        payData: paymentId,
      });
    }
  }
  res.status(200).json({
    payData: "error",
  });
}
