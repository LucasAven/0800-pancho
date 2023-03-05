import axios from "axios";
import { BACKUP_YOUTUBE_STATS } from "constants/index";
import type { NextApiRequest, NextApiResponse } from "next";
import { YOUTUBE_STATS_API, YOUTUBE_THUMBNAIL_API } from "routes";
import type { ApiRouteResponse, YoutubeData } from "types";
import NextCors from "utils/init-middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiRouteResponse<YoutubeData>>
) {
  await NextCors(req, res, {
    methods: ["GET"],
  });

  if (req.method === "GET") {
    try {
      const statsData = await axios.get(YOUTUBE_STATS_API);
      const {
        items: {
          "0": {
            statistics: { videoCount, viewCount },
          },
        },
      } = statsData.data as {
        items: [
          {
            statistics: {
              videoCount: string;
              viewCount: string;
              subscriberCount: string;
            };
          }
        ];
      };

      const thumbnailResponse = await axios.get(YOUTUBE_THUMBNAIL_API);
      const {
        items: {
          "0": {
            snippet: {
              thumbnails: {
                default: { height, url, width },
              },
            },
          },
        },
      } = thumbnailResponse.data as {
        items: [
          {
            snippet: {
              thumbnails: {
                default: { url: string; width: number; height: number };
              };
            };
          }
        ];
      };

      const youtubeData = {
        videoCount,
        viewCount,
        thumbnail: {
          url,
          width,
          height,
        },
      };

      return res.status(200).json({ value: youtubeData });
    } catch (err) {
      return res.status(200).send({
        value: BACKUP_YOUTUBE_STATS,
        message: `Error getting updated YT data, using back up data. Error: ${JSON.stringify(
          err
        )}`,
      });
    }
  } else {
    return res.status(405).send({ message: "Method not allowed." });
  }
}
