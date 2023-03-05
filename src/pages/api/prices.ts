import type { NextApiRequest, NextApiResponse } from "next";
import type { ApiRouteResponse, LicenseType, PricesObject } from "types";
import NextCors from "utils/init-middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiRouteResponse<PricesObject>>
) {
  await NextCors(req, res, {
    methods: ["GET", "POST"],
  });

  switch (req.method) {
    case "GET":
      const { pricesQuantity } = req.query;
      const pricesQuantityNumber = pricesQuantity ? Number(pricesQuantity) : 5;
      try {
        const prices_data = await global.prisma?.price.findMany({
          take: pricesQuantityNumber,
        });

        const prices = !prices_data
          ? ({} as PricesObject)
          : prices_data.reduce((acc, curr) => {
              acc[curr.licenseType as LicenseType] = curr.price;
              return acc;
            }, {} as PricesObject);

        return res.status(200).json({ value: prices });
      } catch (err) {
        return res
          .status(500)
          .send({ message: `Something went wrong: ${JSON.stringify(err)}` });
      }
    case "POST":
      const { prices } = req.body as { prices: PricesObject };
      if (!prices) {
        return res.status(400).send({ message: "Bad request." });
      }
      try {
        for (const [license, price] of Object.entries(prices)) {
          if (Number(price) < 0)
            return res
              .status(400)
              .send({ message: "Bad request. Non negative values allowed" });
          await global.prisma?.price.update({
            where: { licenseType: license as LicenseType },
            data: { price: Number(price) },
          });
        }
        return res.status(200).send({ message: "Prices updated." });
      } catch (err) {
        return res
          .status(500)
          .send({ message: `Something went wrong: ${JSON.stringify(err)}` });
      }
    default:
      return res.status(405).send({ message: "Method not allowed." });
  }
}
