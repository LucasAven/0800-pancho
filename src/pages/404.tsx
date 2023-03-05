import Link from "next/link";
import Head from "next/head";
import { type NextPage } from "next";
import { HOME_PATH } from "routes";

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 | 0800 Pancho</title>
      </Head>
      <section className="flex h-full flex-col items-center justify-center bg-space-image bg-cover bg-center bg-no-repeat text-baseText">
        <h1 className="mb-4 text-8xl font-bold">404</h1>
        <h2 className="text-xl font-medium">Página no encontrada</h2>
        <Link
          href={HOME_PATH}
          className="primary-button mt-32 w-32 font-medium"
        >
          Home
        </Link>
      </section>
    </>
  );
};

export default NotFound;
