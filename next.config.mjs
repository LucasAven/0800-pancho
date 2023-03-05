// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "picsum.photos",
      "0800pancho.vercel.app",
      "i1.ytimg.com",
      "i.ytimg.com",
      "i3.ytimg.com",
      "yt3.ggpht.com",
      "images.unsplash.com",
      "source.unsplash.com",
    ],
  },
};
export default config;
