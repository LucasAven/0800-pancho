import type { Tag } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ApiRouteResponse } from "types";
import NextCors from "utils/init-middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiRouteResponse<Tag[]>>
) {

  await NextCors(req, res, {
    methods: ["GET"],
  });

  if (req.method === "GET") {
    try {
      const data = await prisma?.tag.findMany({
        take: 100
      });
      return res.status(200).json({ value: data ?? [] });
    } catch (err) {
      return res.status(500).send({ message: "Something went wrong" });
    }
  } else {
    return res.status(405).send({ message: "Method not allowed." });
  }
}
