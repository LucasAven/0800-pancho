import type { Beat, File } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { prisma } from "server/db";
import type { ApiRouteResponse, BeatEditable } from "types";
import { getVideoDuration, getYoutubeVideoIdFromUrl, handleDBError } from "utils";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiRouteResponse<File>>
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).send({ message: "Unauthorized." });
    return;
  }

  switch (req.method) {
    case "GET":
      const data = await prisma.file.findUnique({
        where: {
          beatId: req.query.beatId as string,
        },
      });

      if (!data) {
        res.status(404).send({ message: "Beat not found." });
      } else {
        res.status(200).json({ value: data });
      }
      break;

    case "PUT":
      const { beatEditedData, previousBeatData } = req.body as {
        beatEditedData: BeatEditable;
        previousBeatData: BeatEditable;
      };

      if (!beatEditedData || !previousBeatData) {
        res.status(400).send({ message: "Missing data." });
      }

      try {
        if (
          beatEditedData.tag.toLowerCase() !==
          previousBeatData.tag.toLowerCase()
        ) {
          // Create tag if it doesn't exist, otherwise update it
          await prisma.tag.upsert({
            where: {
              tagName: beatEditedData.tag?.toLowerCase(),
            },
            update: {
              tagName: beatEditedData.tag?.toLowerCase(),
            },
            create: {
              tagName: beatEditedData.tag?.toLowerCase(),
            },
          });
        }

        let duration = "";
        let videoId = "";
        if (beatEditedData.video_url !== previousBeatData.video_url) {
          videoId = getYoutubeVideoIdFromUrl(beatEditedData.video_url);
          duration = (await getVideoDuration(videoId)) || "";
        }

        // Update general beat info
        const baseBeatData = {
          title: beatEditedData.title,
          beatId: beatEditedData.beatId,
          tag: beatEditedData.tag,
          bpm: beatEditedData.bpm,
          video_url: beatEditedData.video_url,
          duration: !!duration ? duration : undefined,
          id_video: !!videoId ? videoId : undefined,
          image_url: beatEditedData.image_url,
          scale: beatEditedData.scale,
          searchTitle: beatEditedData.title?.toLowerCase(),
          sold: beatEditedData.sold,
        } as Beat;
        await prisma.beat.update({
          where: {
            beatId: beatEditedData.beatId,
          },
          data: baseBeatData,
        });

        // Update beat links if they changed
        const hasNewBaseFileUrl =
          beatEditedData.baseFileUrl !== previousBeatData.baseFileUrl;
        const hasNewEditableFileUrl =
          beatEditedData.editableFileUrl !== previousBeatData.editableFileUrl;
        if (hasNewBaseFileUrl || hasNewEditableFileUrl) {
          await prisma.file.update({
            where: {
              beatId: req.query.beatId as string,
            },
            data: {
              beatId: req.query.beatId as string,
              baseFileUrl: hasNewBaseFileUrl
                ? beatEditedData.baseFileUrl
                : undefined,
              editableFileUrl: hasNewEditableFileUrl
                ? beatEditedData.editableFileUrl
                : undefined,
            },
          });
        }
        res.status(200).json({ message: "Beat updated." });
      } catch (e) {
        handleDBError(e, res);
      }
      break;

    case "POST":
      const { newBeat, newLinks } = req.body as {
        newBeat: Omit<Beat, "id" | "beatId">;
        newLinks: Omit<File, "id" | "beatId">;
      };

      if (!newBeat || !newLinks) {
        res.status(400).send({ message: "Missing data." });
        return;
      }

      try {
        // Create beat
        const beatCreated = await prisma.beat.create({ data: newBeat });

        if (!beatCreated?.beatId) {
          res.status(500).send({ message: "Internal server error." });
          return;
        }

        // Create tag if it doesn't exist, otherwise update it
        await prisma.tag.upsert({
          where: {
            tagName: newBeat.tag?.toLowerCase(),
          },
          update: {
            tagName: newBeat.tag?.toLowerCase(),
          },
          create: {
            tagName: newBeat.tag?.toLowerCase(),
          },
        });

        // Create beat links
        await prisma.file.create({
          data: { ...newLinks, beatId: beatCreated.beatId },
        });

        res.status(200).json({ message: "Beat created." });
      } catch (e) {
        handleDBError(e, res);
      }

      break;

    case "DELETE":
      // Delete beat
      await prisma.beat.delete({
        where: {
          beatId: req.query.beatId as string,
        },
      });

      // Delete beat links
      await prisma.file.delete({
        where: {
          beatId: req.query.beatId as string,
        },
      });

      res.status(200).json({ message: "Beat deleted." });
      break;

    default:
      res.status(405).send({ message: "Method not allowed." });
      break;
  }
}
