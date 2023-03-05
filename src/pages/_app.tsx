import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { Libre_Franklin } from "@next/font/google";
import { SessionProvider } from "next-auth/react";

import "../styles/globals.css";
import Layout from "components/Layout";
import Head from "next/head";
import { PlayerContextProvider } from "contexts/PlayerContext";
import Player from "components/Player";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useState } from "react";

const libreFranklin = Libre_Franklin({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const MyApp: AppType<{ session: Session | null; dehydratedState: unknown }> = ({
  Component,
  pageProps: { session, dehydratedState, ...pageProps },
}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={dehydratedState}>
            <PlayerContextProvider>
              <Layout className={libreFranklin.className}>
                <Component {...pageProps} />
                <ReactQueryDevtools initialIsOpen={false} />
              </Layout>
              <Player />
            </PlayerContextProvider>
          </Hydrate>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
};

export default MyApp;
