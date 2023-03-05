import SearchBar from "components/SearchBar";
import SectionTitle from "components/SectionTitle";
import type { BeatData } from "types";
import { cn } from "utils";
import TracksTable from "./TracksTable";

export interface ITracksProps {
  showAllBeats?: boolean;
  defaultBeats?: BeatData[];
  adminView?: boolean;
}

const Tracks: React.FC<ITracksProps> = ({
  showAllBeats = false,
  defaultBeats = [],
  adminView = false,
}) => {
  return (
    <section
      className={cn(
        "relative bg-bg text-white",
        !showAllBeats && "pb-14 shadow-sections"
      )}
    >
      <SectionTitle isAbsolute={!showAllBeats} className={cn(adminView && "hidden")}>TRACKS</SectionTitle>

      {showAllBeats && <SearchBar />}

      <div className="mx-auto min-h-[390px] max-w-6xl p-4 pb-8 md:min-h-[540px]">
        <TracksTable
          showAllBeats={showAllBeats}
          defaultBeats={defaultBeats}
          adminView={adminView}
        />
      </div>
    </section>
  );
};

export default Tracks;
