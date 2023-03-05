import { PrismaClient } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";

const prisma = new PrismaClient();
async function main() {

  // for (let i = 0; i < 50; i++) {
  //   const rand = Math.floor(Math.random() * 3);
  //   const tags = ["trap", "rap", "rkt"];
  //   const tag = tags[rand] || "rap";
  //   await prisma.beat.create({
  //     data: {
  //       bpm: "120",
  //       beatId: createId(),
  //       duration: "4:00",
  //       id_video: i.toString(),
  //       image_url: "https://source.unsplash.com/random",
  //       scale: "C",
  //       title: `Beat ${i}`,
  //       searchTitle: `beat ${i}`,
  //       tag: tag,
  //       video_url: "https://www.youtube.com/watch?v=1Q8fG0TtVAY",
  //       sold: rand === 0 ? true : false,
  //     },
  //   });
  // }

  const beats = await prisma.beat.findMany({take: 100});

    for (let i = 0; i < beats.length; i++) {
      await prisma.file.create({
        data: {
          beatId: beats[i]?.beatId ?? "",
          editableFileUrl: "https://source.unsplash.com/random",
          baseFileUrl: "https://www.youtube.com/watch?v=1Q8fG0TtVAY",
        },
      });
    }


}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
