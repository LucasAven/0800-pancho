import { useState, useEffect } from "react";
import YoutubeSVG from "components/svgs/YoutubeSVG";
import Image from "next/image";

const YoutubeSection = () => {
  const channelID = process.env.NEXT_PUBLIC_CHANNEL_ID;
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const [videosCount, setVideosCount] = useState(125);
  const [viewsCount, setViewsCount] = useState(31626);
  const [profileImage, setProfileImage] = useState("/pancho_profile_logo.jpg");
  useEffect(() => {
    let getYoutubeData = () => {
      fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelID}&key=${apiKey}`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setVideosCount(data["items"][0].statistics.videoCount);
          setViewsCount(data["items"][0].statistics.viewCount);
        })
        .catch((err) => {
          console.log(err);
        });
      fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelID}&fields=items%2Fsnippet%2Fthumbnails&key=${apiKey}`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setProfileImage(data["items"][0].snippet.thumbnails.default.url);
        })
        .catch((err) => {
          console.log(err);
          setProfileImage("/pancho_profile_logo.jpg");
        });
    };
    getYoutubeData();
  }, [channelID, apiKey]);

  return (
    <section className="youtube-section">
      <div className="youtube-section__container">
        <div className="youtube-section__channel">
          <div className="youtube-section__channel__image-container">
            <Image
              src={profileImage}
              alt="0800 Pancho Youtube Logo"
              width={88}
              height={88}
            />
          </div>
          <div className="youtube-section__channel__title-container">
            <h3>0800Pancho</h3>
          </div>
        </div>
        <div className="youtube-section__info">
          <div className="youtube-section__info__container">
            <div>
              <Image src="/visualizacion.svg" alt="" width={88} height={88} />
            </div>
            <div style={{ width: "100%" }}>
              <h4>Total views:</h4>
              <p>{viewsCount}</p>
            </div>
          </div>
          <div className="youtube-section__info__container">
            <div>
              <Image src="/videos.svg" alt="" width={88} height={88} />
            </div>
            <div style={{ width: "100%" }}>
              <h4>Videos:</h4>
              <p>{videosCount}</p>
            </div>
          </div>
        </div>
        <a
          href={`https://www.youtube.com/channel/${channelID}?sub_confirmation=1`}
          className="subscribe-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <YoutubeSVG width={25} height={30} fill="#000" />
          <span>Suscribirse</span>
        </a>
      </div>
    </section>
  );
};

export default YoutubeSection;
