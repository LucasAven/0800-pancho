import { type FC } from "react";
import YoutubeSVG from "components/svgs/YoutubeSVG";
import Image from "next/image";
import {
  YOUTUBE_CHANNEL_URL,
  YOUTUBE_VIDEOS_ICON,
  YOUTUBE_VISUALIZATIONS_ICON,
} from "constants/index";
import type { YoutubeData } from "types";

interface IYoutubeSectionInfoProps {
  title: string;
  imageUrl: string;
  content: string | number;
}

const YoutubeSectionInfo: FC<IYoutubeSectionInfoProps> = ({
  title,
  imageUrl,
  content,
}) => {
  return (
    <div className="flex flex-col items-center gap-1 text-center big-md:flex-row big-md:gap-8">
      <div className="w-16 big-md:w-20">
        <Image src={imageUrl} alt="" width={88} height={88} />
      </div>
      <div className="w-full">
        <h4 className="text-sm font-bold capitalize">{title}:</h4>
        <p className="text-2xl font-bold">{content}</p>
      </div>
    </div>
  );
};

export interface IYoutubeSectionProps {
  data: YoutubeData;
}

const YoutubeSection: FC<IYoutubeSectionProps> = ({ data }) => {

  return (
    <section className="flex py-5 big-md:w-1/2 big-md:max-w-2xl">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-between gap-14 text-baseText">
        <div className="flex flex-col items-center gap-3 big-md:ml-24 big-md:flex-row big-md:self-start">
          <div className="h-[88px] w-[88px] big-md:h-16 big-md:w-16">
            <Image
              src={data.thumbnail.url}
              alt="0800 Pancho Youtube Logo"
              width={data.thumbnail.width}
              height={data.thumbnail.height}
              className="max-w-full rounded-full"
            />
          </div>
          <div className="text-2xl font-bold tracking-wide">
            <h3>0800Pancho</h3>
          </div>
        </div>
        <div className="flex w-full justify-evenly big-md:w-auto big-md:flex-col big-md:gap-4">
          <YoutubeSectionInfo
            title="Total views"
            imageUrl={YOUTUBE_VISUALIZATIONS_ICON}
            content={data.viewCount}
          />
          <YoutubeSectionInfo
            title="Videos"
            imageUrl={YOUTUBE_VIDEOS_ICON}
            content={data.videoCount}
          />
        </div>
        <a
          href={`${YOUTUBE_CHANNEL_URL}?sub_confirmation=1`}
          className="primary-button gap-3 px-4 py-2 text-black"
          target="_blank"
          rel="noopener noreferrer"
        >
          <YoutubeSVG width={25} height={30} />
          <span>Suscribirse</span>
        </a>
      </div>
    </section>
  );
};

export default YoutubeSection;
