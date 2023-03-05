import type { NextApiRequest, NextApiResponse } from "next";
import { HOME_PATH } from "routes";
import NextCors from "utils/init-middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET", "POST", "OPTIONS"],
  });

  const { secret, beatId } = req.query;

  if (!secret || !beatId)
    return res.status(400).json({ message: "Missing data" });

  if (req.query.secret !== process.env.REVALIDATE_SECRET)
    return res.status(401).json({ message: "Invalid token" });

  try {
    // Revalidate the home page
    await res.revalidate(HOME_PATH);
    // Revalidate the beat page
    await res.revalidate(`/beat/${beatId as string}`);
    return res.send("Revalidated");
  } catch (err) {
    return res.status(500).send("Error revalidating");
  }
}
