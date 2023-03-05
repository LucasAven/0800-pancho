import { createContext, useContext, useMemo, useState } from "react";
import type { BeatData, PlayerContextProps } from "types";

export const PlayerContext = createContext<PlayerContextProps>({
  beatClicked: null,
  beatsList: [],
  showPlayer: false,
  setShowPlayer: () => null,
  setBeatClicked: () => null,
  setBeatsList: () => null,
});

interface PlayerContextProviderProps {
  children: React.ReactNode;
}

export const PlayerContextProvider: React.FC<PlayerContextProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [beatClicked, setBeatClicked] = useState <BeatData | null>(null);
  const [beatsList, setBeatsList] = useState([] as BeatData[]);

  const value = useMemo(() => {
    return {
      beatClicked,
      beatsList,
      showPlayer: isVisible,
      setShowPlayer: setIsVisible,
      setBeatClicked,
      setBeatsList,
    };
  }, [isVisible, beatClicked, beatsList, setIsVisible]);

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextProps => useContext(PlayerContext);
