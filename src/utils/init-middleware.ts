import cors, { type CorsOptions, type CorsOptionsDelegate } from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import { getCorrectBaseUrl } from "utils";

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function initMiddleware(middleware: typeof cors) {
  return (
    req: NextApiRequest,
    res: NextApiResponse,
    options?: CorsOptions | CorsOptionsDelegate
  ) =>
    new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      middleware({
        ...options,
        origin: getCorrectBaseUrl(),
      })(req, res, (result: Error | unknown) => {
        if (result instanceof Error) {
          return reject(result);
        }

        return resolve(result);
      });
    });
}

const NextCors = initMiddleware(cors);

export default NextCors;
