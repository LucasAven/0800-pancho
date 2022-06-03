import Layout from "components/Layout";
import "styles/global.css";
import Head from "next/head";
import Player from "components/Player";
import { useState } from "react";
import PlayerContext from "contexts/PlayerContext";
const App = ({ Component, pageProps }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [beatClicked, setBeatClicked] = useState(null);
  const [beatsList, setBeatsList] = useState();
  const handleIsVisible = (isVisible) => {
    setIsVisible(isVisible);
  };
  const handleBeatClicked = (beat) => {
    setBeatClicked(beat);
  };
  const handleBeatList = (beats) => {
    setBeatsList(beats);
  };
  const data = {
    state: {
      beatClicked,
      beatsList,
    },
    setShowPlayer: handleIsVisible,
    setBeatClicked: handleBeatClicked,
    setBeatsList: handleBeatList,
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <Layout>
        <PlayerContext.Provider value={data}>
          <Component {...pageProps} />
          <Player beat={beatClicked} beats={beatsList} isVisible={isVisible} />
        </PlayerContext.Provider>
      </Layout>
    </>
  );
};

export default App;
