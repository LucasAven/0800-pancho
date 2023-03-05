import type { Beat } from "@prisma/client";
import { SEARCH_BEATS_KEY } from "constants/index";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { ADMIN_PATH, TRACK_LIST_PATH } from "routes";
import type { BeatData, SelectorOption } from "types";
import { normalizeInfiniteScrollBeatsData, searchBeat } from "utils";

interface IUseSearch {
  hasDefaultBeats?: boolean;
}

const useSearch = (options: IUseSearch = { hasDefaultBeats: false }) => {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchTitleDebounced, setSearchTitleDebounced] = useState("");
  const [tagSelected, setTagSelected] = useState<SelectorOption | null>(null);
  const [showSoldBeats, setShowSoldBeats] = useState(false);

  const {
    isLoading: isLoadingBeats,
    isFetchingNextPage: isFetchingNextBeats,
    data: beats,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery(
    [SEARCH_BEATS_KEY, searchTitleDebounced, tagSelected?.value, showSoldBeats],
    ({ pageParam = "", signal }) =>
      searchBeat(
        searchTitleDebounced,
        tagSelected?.value,
        pageParam as string,
        showSoldBeats,
        signal
      ),
    {
      enabled: !options.hasDefaultBeats,
      getNextPageParam: (lastPage) =>
        lastPage.nextId ? lastPage.nextId : false,
      staleTime: 120 * 1000,
    }
  );

  const router = useRouter();
  const { pathname, query, push } = router;

  useEffect(() => {
    const pushQuery = setTimeout(() => {
      if (pathname !== TRACK_LIST_PATH && pathname !== ADMIN_PATH) return;
      const newQuery = {
        ...query,
        search: searchTitle || undefined,
        tag: tagSelected?.value,
      };

      !newQuery.search && delete newQuery.search;
      !tagSelected?.value && delete newQuery.tag;

      void push(
        {
          pathname,
          query: { ...newQuery },
        },
        undefined,
        { shallow: true }
      );
    }, 600);

    return () => clearTimeout(pushQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTitle, tagSelected]);

  useEffect(() => {
    if (query.search) {
      setSearchTitle(query.search as string);
      setSearchTitleDebounced(query.search as string);
    } else {
      setSearchTitle("");
      setSearchTitleDebounced("");
    }
  }, [query.search]);

  useEffect(() => {
    if (query.tag) {
      const tag = query.tag as string;
      setTagSelected({ label: tag.toUpperCase(), value: tag });
    } else {
      setTagSelected(null);
    }
  }, [query.tag]);

  const loadMoreBeats = useCallback(() => {
    if (!hasNextPage) return;
    void fetchNextPage();
  }, [fetchNextPage, hasNextPage]);

  const beatNotFound = useMemo(
    () => beats?.pages[0]?.beats.length === 0,
    [beats]
  );

  const refetchBeatPage = async (beat: BeatData) => {
    await refetch({
      refetchPage: (page: { beats: Beat[]; nextId: string }) =>
        page.beats.includes(beat),
    });
  };

  return {
    search: searchTitle,
    setSearch: setSearchTitle,
    isShowingSoldBeats: showSoldBeats,
    showSoldBeats: setShowSoldBeats,
    tag: tagSelected,
    setTag: setTagSelected,
    query,
    isLoadingBeats,
    isFetchingNextBeats,
    beats: normalizeInfiniteScrollBeatsData(beats),
    loadMoreBeats,
    manualLoadMoreBeats: fetchNextPage,
    hasNextBeats: hasNextPage,
    beatNotFound,
    refetchBeatPage,
  };
};

export default useSearch;
