import type { Beat } from "@prisma/client";
import { BEATS_PER_PAGE } from "constants/index";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "server/db";
import NextCors from "utils/init-middleware";

type BeatsResponseCursor = {
  beats?: Beat[];
  nextId?: number | undefined;
  cursor?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BeatsResponseCursor>
) {
  await NextCors(req, res, {
    methods: ["GET"],
  });

  if (req.method === "GET") {
    const { searchTitle, tag, cursor, soldBeats } = req.query;

    // check if soldBeats is not undefined and if so convert it to a boolean
    // if it is undefined, then it will be false
    const soldBeatsBool = soldBeats ? soldBeats === "true" : false;

    try {
      const beats = await prisma.beat.findMany({
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: parseInt(cursor as string, 10) } : undefined,
        take: soldBeats ? undefined : BEATS_PER_PAGE,
        where: {
          tag: {
            equals: (tag as string) ?? undefined,
          },
          searchTitle: {
            contains: (searchTitle as string) ?? undefined,
          },
          sold: !soldBeatsBool ? undefined : soldBeatsBool,
        },
      });

      return res.json({
        beats,
        nextId:
          beats?.length === BEATS_PER_PAGE
            ? beats[BEATS_PER_PAGE - 1]?.id
            : undefined,
      });
    } catch (err) {
      return res.status(500).send({ message: "Something went wrong" });
    }
  } else {
    return res.status(405).send({ message: "Method not allowed." });
  }
}
