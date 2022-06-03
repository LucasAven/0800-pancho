import { firebaseApp } from "utils/firebase";
import {
  endAt,
  get,
  getDatabase,
  limitToFirst,
  orderByChild,
  orderByKey,
  query,
  ref,
  startAfter,
  startAt,
} from "firebase/database";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import SearchBar from "./SearchBar";
import TracksTable from "./TracksTable";
import Title from "components/Title";
import PlayerContext from "contexts/PlayerContext";

const database = getDatabase(firebaseApp);
const dbRef = ref(database, "beats/");

//* Esto es para cuando showAllBeats es false
const initialFetchAmount = 5;

//* Esto es para cuando showAllBeats es true
const initialFetchAmountForAll = 5;
const onLoadMoreFetchAmount = 5;

const Tracks = ({ showAllBeats = false }) => {
  const [beats, setBeats] = useState({});
  const [loading, setLoading] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const navigate = useRouter();
  const value = useContext(PlayerContext);
  const { setShowPlayer, setBeatClicked, setBeatsList } = value;
  const { beatClicked, beatsList } = value.state;

  useEffect(() => {
    setLoading(true);
    get(
      query(
        dbRef,
        orderByKey(),
        limitToFirst(
          showAllBeats ? initialFetchAmountForAll : initialFetchAmount
        )
      )
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          setBeats(snapshot.val());
        }
      })
      .then(() => setLoading(null))
      .catch((error) => {
        console.error(error);
        setBeats({});
      });
  }, [navigate, showAllBeats]);

  useEffect(() => {
    if (beatsList) {
      if (Object.keys(beatsList).length !== Object.keys(beats).length) {
        setBeatsList(beats);
      }
    }
  }, [beats]);

  const loadDefaultBeats = () => {
    setShowLoadMore(true);
    setHasMore(true);
    setLoading(true);
    get(
      query(
        dbRef,
        orderByKey(),
        limitToFirst(
          showAllBeats ? initialFetchAmountForAll : initialFetchAmount
        )
      )
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          setBeats(snapshot.val());
        }
      })
      .then(() => setLoading(null))
      .catch((error) => {
        console.error(error);
        setBeats({});
      });
  };

  const playAudio = (beat) => {
    if (beatClicked?.id_video !== beat.id_video) {
      setBeatClicked(beat);
      if (!beatClicked) {
        setShowPlayer(true);
        setBeatsList(beats);
      }
    }
  };

  const loadMore = () => {
    setLoading(true);
    const queryNotTag = query(
      dbRef,
      orderByKey(),
      startAfter(Object.values(beats).at(-1).key),
      limitToFirst(onLoadMoreFetchAmount)
    );
    const queryTag = query(
      dbRef,
      orderByChild("categoria"),
      startAt(currentTag),
      endAt(currentTag + "\uf8ff"),
      limitToFirst(Object.values(beats).length + onLoadMoreFetchAmount)
    );
    get(currentTag === null ? queryNotTag : queryTag)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const newBeats = snapshot.val();
          const updatedBeats = { ...beats, ...newBeats };
          if (
            Object.values(updatedBeats).length === Object.values(beats).length
          ) {
            setHasMore(false);
          } else {
            setBeats(updatedBeats);
          }
        } else {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(null));
  };

  const handleSearch = (title) => {
    setShowLoadMore(false);
    setLoading(true);
    get(
      query(
        dbRef,
        orderByChild("searchTitle"),
        startAt(title),
        endAt(title + "\uf8ff")
      )
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          const foundBeats = snapshot.val();
          const updatedBeats = { ...foundBeats };
          setBeats(updatedBeats);
          setNotFound(false);
        } else {
          setBeats({});
          setNotFound(true);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(null));
  };

  const handleSort = (tag) => {
    setShowLoadMore(true);
    setHasMore(true);
    if (tag === "All") {
      setCurrentTag(null);
      loadDefaultBeats();
      return;
    }
    setCurrentTag(tag);
    setLoading(true);
    get(
      query(
        dbRef,
        orderByChild("categoria"),
        startAt(tag),
        endAt(tag + "\uf8ff"),
        limitToFirst(
          showAllBeats ? initialFetchAmountForAll : initialFetchAmount
        )
      )
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          const foundBeats = snapshot.val();
          const updatedBeats = { ...foundBeats };
          setBeats(updatedBeats);
          setNotFound(false);
        } else {
          setBeats({});
          setNotFound(true);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(null));
  };

  const handleBuy = (beat) => {
    navigate.replace(`/confirmPurchase/${beat.key}`);
  };

  return (
    <>
      <section
        className={`track-section ${showAllBeats ? "" : "sections-shadow"}`}
        style={showAllBeats ? { minHeight: "calc(100vh - 182px)" } : {}}
      >
        <Title title="TRACKS" isAbsolute={!showAllBeats} />
        {showAllBeats && (
          <SearchBar onSearch={handleSearch} onReset={loadDefaultBeats} />
        )}
        <div
          className="tracks-container"
          style={showAllBeats ? { minHeight: "calc(100vh - 300px)" } : {}}
        >
          <TracksTable
            beats={beats}
            onPlayAudio={playAudio}
            onSort={handleSort}
            onBuy={handleBuy}
          />
          {loading && <div className="loader"></div>}
          {showAllBeats && (
            <>
              {notFound && (
                <p style={{ textAlign: "center", padding: "1rem" }}>
                  No se encontró el beat
                </p>
              )}
              {hasMore && showLoadMore
                ? !loading && (
                    <button className="seeMore-btn" onClick={loadMore}>
                      CARGAR MÁS
                    </button>
                  )
                : showLoadMore && (
                    <p style={{ textAlign: "center", padding: "1rem" }}>
                      <b>Eso son todos los beats!</b>
                    </p>
                  )}
            </>
          )}
          {!showAllBeats && (
            <button
              className="seeMore-btn"
              onClick={() => navigate.replace("/trackList")}
            >
              VER TODOS LOS BEATS
            </button>
          )}
        </div>
      </section>
    </>
  );
};

export default Tracks;
