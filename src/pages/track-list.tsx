import Tracks from "components/Tracks";
import Head from "next/head";

const TrackList = () => {
  return (
    <>
      <Head>
        <title>Tracks | 0800 Pancho</title>
      </Head>
      <Tracks showAllBeats />
    </>
  );
};

export default TrackList;
