import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { YOUTUBE_VIDEO_DATA_API } from "routes";
import type { ApiRouteResponse } from "types";
import { getFormattedVideoDuration } from "utils";
import NextCors from "utils/init-middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiRouteResponse<string>>
) {
  await NextCors(req, res, {
    methods: ["GET"],
  });

  if (req.method === "GET") {
    const videoId = req.query.videoId as string;
    try {
      const response = await axios.get(`${YOUTUBE_VIDEO_DATA_API}${videoId}`);
      const parsedData = response.data as {
        items: {
          contentDetails: {
            duration: string;
          };
        }[];
      };
      const duration = getFormattedVideoDuration(
        parsedData?.items?.[0]?.contentDetails.duration || ""
      );

      return res.status(200).json({ value: duration });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Something went wrong" });
    }
  } else {
    return res.status(405).send({ message: "Method not allowed." });
  }
}
