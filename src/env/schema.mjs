// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  // REVALIDATE_SECRET: z.string().min(1),
  // DATABASE_URL: z.string().url(),
  // NODE_ENV: z.enum(["development", "test", "production"]),
  // NEXTAUTH_SECRET:
  //   process.env.NODE_ENV === "production"
  //     ? z.string().min(1)
  //     : z.string().min(1).optional(),
  // NEXTAUTH_URL: z.preprocess(
  //   // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
  //   // Since NextAuth.js automatically uses the VERCEL_URL if present.
  //   (str) => process.env.VERCEL_URL ?? str,
  //   // VERCEL_URL doesn't include `https` so it cant be validated as a URL
  //   process.env.VERCEL ? z.string() : z.string().url()
  // ),
  // EMAIL_SERVER_USER: z.string().email().min(1),
  // EMAIL_SERVER_PASSWORD: z.string().min(1),
  // EMAIL_SERVER_HOST: z.string().min(1),
  // EMAIL_SERVER_PORT: z.string().min(1),
  // EMAIL_FROM: z.string().email().min(1),
  // ADMIN_EMAILS: z
  //   .string()
  //   .transform((str) => str.split(",")),
  // YOUTUBE_API_KEY: z.string(),
  // CHANNEL_ID: z.string().min(1),
  // MP_PUBLIC_KEY: z.string().min(1),
  // MP_ACCESS_TOKEN: z.string().min(1),
  // GMAIL_USER: z.string().email().min(1),
  // GMAIL_PASS: z.string().min(1),
});

export const serverEnv = {
  // REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
  // DATABASE_URL: process.env.DATABASE_URL,
  // NODE_ENV: process.env.NODE_ENV,
  // NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  // NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  // EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
  // EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
  // EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
  // EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
  // EMAIL_FROM: process.env.EMAIL_FROM,
  // ADMIN_EMAILS: process.env.ADMIN_EMAILS?.split(","),
  // YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  // CHANNEL_ID: process.env.CHANNEL_ID,
  // MP_PUBLIC_KEY: process.env.MP_PUBLIC_KEY,
  // MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,
  // GMAIL_USER: process.env.GMAIL_USER,
  // GMAIL_PASS: process.env.GMAIL_PASS,
};

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  // NEXT_PUBLIC_CONTACT_EMAIL: z.string().email().min(1),
  // NEXT_PUBLIC_DEFAULT_DOLLAR_VALUE: z.string().min(1),
  // NEXT_PUBLIC_YT_CHANNEL_ID: z.string().min(1),
  // NEXT_PUBLIC_BASE_URL: z.string().url(),
});

// export const clientEnv = {
//   NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
//   NEXT_PUBLIC_DEFAULT_DOLLAR_VALUE:
//     process.env.NEXT_PUBLIC_DEFAULT_DOLLAR_VALUE,
//   NEXT_PUBLIC_YT_CHANNEL_ID: process.env.NEXT_PUBLIC_YT_CHANNEL_ID,
//   NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
// };
