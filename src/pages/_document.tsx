import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="0800 Pancho web oficial donde podras obtener todos mis beats y más!"
        />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body className="bg-bg">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
