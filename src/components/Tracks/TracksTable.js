import Beat from "components/Beat";
import TagSelector from "./TagSelector";

const TracksTable = ({ beats, onPlayAudio, onSort, onBuy }) => {
  return (
    <>
      <TagSelector onSort={onSort} />
      <table className="tracksTable">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th className="track-show-md">TITULO</th>
            <th className="track-show-lg">DURACION</th>
            <th className="track-show-md">BPM</th>
            <th className="track-show-md">ESCALA</th>
            <th className="track-show-md">TAGS</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(beats).length !== 0 &&
            Object.entries(beats).map(([key, beat]) => (
              <Beat key={key} beat={beat} onPlay={onPlayAudio} onBuy={onBuy} />
            ))}
        </tbody>
      </table>
    </>
  );
};

export default TracksTable;
