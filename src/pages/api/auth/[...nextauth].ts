import NextAuth, { type Theme, type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from "server/db";
import { createTransport } from "nodemailer";

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
const generateEmailHTMLBody = (params: {
  url: string;
  host: string;
  theme: Theme;
}) => {
  const { url, host } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = "#b38325";
  const color = {
    background: "#f9f9f9",
    text: "#eee",
    mainBackground: "#000",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#eee",
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Iniciar sesion en <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Iniciar Sesion</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Si no trataste de iniciar sesion podes ignorar este mensaje.
      </td>
    </tr>
  </table>
</body>
`;
};

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
const generateEmailTextBody = ({ url, host }: { url: string; host: string }) =>
  `Iniciar sesion en ${host}\n${url}\n\n`;

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    // Allow access to the admin panel only for users with admin emails
    signIn({ user }) {
      if (user.email && process.env.ADMIN_EMAILS) {
        return process.env.ADMIN_EMAILS.includes(user.email);
      }
      return "/";
    },
  },
  pages: {
    verifyRequest: "/admin/verify-email",
    error: "/admin/permission-denied",
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest(params) {
        const { identifier, url, provider, theme } = params;
        const { host } = new URL(url);
        // NOTE: You are not required to use `nodemailer`, use whatever you want.
        const transport = createTransport(provider.server);
        transport
          .sendMail({
            to: identifier,
            from: provider.from,
            subject: `Iniciar sesion en ${host}`,
            text: generateEmailTextBody({ url, host }),
            html: generateEmailHTMLBody({ url, host, theme }),
          })
          .catch((error) =>
            console.error("SEND_VERIFICATION_EMAIL_ERROR", error)
          );
      },
    }),
  ],
};

export default NextAuth(authOptions);
