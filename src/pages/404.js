import Link from "next/link";
import Head from "next/head";
const NotFound = () => {
  return (
    <>
      <Head>
        <title>404 | 0800 Pancho</title>
      </Head>
      <section className="not-found-container">
        <h1>404</h1>
        <div className="not-found__cloak__wrapper">
          <div className="cloak__container">
            <div className="cloak"></div>
          </div>
        </div>
        <div className="not-found__info">
          <h2>Página no encontrada</h2>
          <Link href="/">
            <a className="not-found__back-button seeMore-btn">Home</a>
          </Link>
        </div>
      </section>
    </>
  );
};

export default NotFound;
