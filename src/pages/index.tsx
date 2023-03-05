import ContactForm from "components/ContactForm";
import Header from "components/Header";
import Licenses from "components/Licenses";
import Tracks from "components/Tracks";
import YoutubeSection from "components/YoutubeSection";
import Head from "next/head";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import type { BeatData } from "types";
import {
  BACKUP_YOUTUBE_STATS,
  BEATS_MAIN_PAGE,
  DEFAULT_DOLLAR_VALUE,
  GET_DOLLAR_VALUE_KEY,
  GET_PRICES_KEY,
  GET_YOUTUBE_DATA_KEY,
} from "constants/index";
import { useQuery, useQueryClient } from "react-query";
import {
  convertUSDPricesToARS,
  fetchDollarPrice,
  getPrices,
  getYoutubeData,
} from "utils";
import { useMemo } from "react";

const Home = ({ beats }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const queryClient = useQueryClient();

  const { data: usdPrices } = useQuery([GET_PRICES_KEY], () => getPrices(), {
    staleTime: Infinity,
  });

  const { data: dollarValue } = useQuery(
    [GET_DOLLAR_VALUE_KEY],
    fetchDollarPrice,
    {
      staleTime: Infinity,
      retry(failureCount) {
        return failureCount < 3;
      },
      onError: () => {
        queryClient.setQueryData(GET_DOLLAR_VALUE_KEY, DEFAULT_DOLLAR_VALUE);
      },
    }
  );

  const { data: youtubeData } = useQuery(
    [GET_YOUTUBE_DATA_KEY],
    getYoutubeData,
    {
      staleTime: Infinity,
      retry(failureCount) {
        return failureCount < 3;
      },
    }
  );

  const prices = useMemo(() => {
    if (!usdPrices || !dollarValue) return null;
    return convertUSDPricesToARS(usdPrices, dollarValue);
  }, [usdPrices, dollarValue]);

  return (
    <>
      <Head>
        <title>Home |0800 Pancho</title>
      </Head>
      <Header />

      <Tracks defaultBeats={beats} />

      <Licenses prices={prices} />
      <div className="flex flex-col-reverse justify-center bg-bg py-4 big-md:flex-row">
        <ContactForm />
        <YoutubeSection data={youtubeData || BACKUP_YOUTUBE_STATS} />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<{
  beats: BeatData[];
}> = async () => {
  const beatsData = await global.prisma?.beat.findMany({
    take: BEATS_MAIN_PAGE,
  });
  const beats = !beatsData ? [] : beatsData;

  return {
    props: { beats },
    revalidate: 120,
  };
};

export default Home;
