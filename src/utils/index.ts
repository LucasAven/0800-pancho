import type { Beat, File, Tag } from "@prisma/client";
import { Prisma } from "@prisma/client";
import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { DEFAULT_DOLLAR_VALUE, DOLLARS_API_URL } from "constants/index";
import type { SendMailOptions } from "nodemailer";
import type { InfiniteData } from "react-query";
import {
  BEATS_API,
  GET_PRICES_API,
  GET_TAGS_API,
  GET_VIDEO_DURATION_API,
  GET_YOUTUBE_STATS_API,
  MP_CHECKOUT_API,
  REVALIDATE_BEAT_PAGE_API,
  SEARCH_BEATS_API,
  SEND_EMAIL_API,
  SEND_ERROR_EMAIL_API,
} from "routes";
import { twMerge } from "tailwind-merge";
import type {
  ApiRouteResponse,
  CheckoutBody,
  LicenseType,
  MailData,
  PricesObject,
  SelectorOption,
  YoutubeData,
  BeatEditable,
} from "types";
import { z } from "zod";
import type { NextApiResponse } from "next";

// temporal fix for creating a zod schema from a type (https://github.com/colinhacks/zod/issues/53#issuecomment-1386446580)
type AnyObj = Record<PropertyKey, unknown>;

type ZodObj<T extends AnyObj> = {
  [key in keyof T]: z.ZodType<T[key]>;
};

export const zObject = <T extends AnyObj>(arg: ZodObj<T>) => z.object(arg);
// end of temporal fix

export const getCorrectBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_BASE_URL;
  } else {
    return "http://localhost:3000";
  }
};

export const axiosInstance = axios.create({
  baseURL: getCorrectBaseUrl(),
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const numberToStringWithLeadingZeroes = (
  number: number,
  leadingZerosAmount = 2
): string =>
  number.toLocaleString("en-US", {
    minimumIntegerDigits: leadingZerosAmount >= 2 ? leadingZerosAmount : 2,
    useGrouping: false,
  });

export const isEllipsisActive = (e: Element) => {
  return e.clientWidth < e.scrollWidth;
};

// Dollar related utils
export const convertUSDPricesToARS = (
  prices: PricesObject,
  dollarValue: number | undefined
) => {
  const dollarValueToUse = dollarValue || DEFAULT_DOLLAR_VALUE;
  return Object.entries(prices).reduce((acc, [license, price]) => {
    acc[license as LicenseType] = price * dollarValueToUse;
    return acc;
  }, {} as PricesObject);
};

export const fetchDollarPrice = async () =>
  await axios
    .get(DOLLARS_API_URL)
    .then(({ data }) =>
      Number((data as { blue: { value_sell: string } }).blue.value_sell)
    );

// Beat fetching utils
export const normalizeInfiniteScrollBeatsData = (
  data:
    | InfiniteData<{
        beats: Beat[];
        nextId: string;
      }>
    | undefined
) => {
  if (!data || !data.pages.length) return [];
  const { pages } = data;
  const beats = pages.map((page) => page.beats).flat();
  return beats;
};

export const getTags = async () => {
  const data = await axiosInstance.get<ApiRouteResponse<Tag[]>>(GET_TAGS_API);
  const { value } = data.data;

  if (!value) return [];

  const mappedTags: SelectorOption[] = value.map((tag) => ({
    label: tag.tagName.toUpperCase(),
    value: tag.tagName,
  }));

  return mappedTags;
};

export const searchBeat = async (
  title?: string,
  tag?: string,
  cursor?: string,
  soldBeats?: boolean,
  signal?: AbortSignal
) => {
  const formattedTitle = title?.toLowerCase()?.trim();

  const data = await axiosInstance.get(SEARCH_BEATS_API, {
    params: {
      searchTitle: formattedTitle ?? undefined,
      tag: tag ?? undefined,
      cursor: cursor ?? undefined,
      soldBeats: soldBeats ?? undefined,
    },
    signal,
  });
  const { beats, nextId } = data.data as { beats: Beat[]; nextId: string };
  return { beats, nextId };
};

// CRUD Beats utils
export const getBeatLinks = async (beatId: string) => {
  const response = await axiosInstance.get<ApiRouteResponse<File>>(BEATS_API, {
    params: { beatId },
  });
  const { value } = response.data;
  return value;
};

export const deleteBeat = async (beatId: string) => {
  await axiosInstance.delete(BEATS_API, {
    params: { beatId },
  });
};

export const updateBeat = async (updateFields: {
  beatEditedData: BeatEditable;
  previousBeatData: BeatEditable;
}) => {
  await axiosInstance.put(BEATS_API, {
    beatEditedData: updateFields.beatEditedData,
    previousBeatData: updateFields.previousBeatData,
  });
};

export const createBeat = async (data: {
  newBeat: Omit<Beat, "id" | "beatId">;
  newLinks: Omit<File, "id" | "beatId">;
}) => {
  return await axiosInstance.post(BEATS_API, {
    newBeat: data.newBeat,
    newLinks: data.newLinks,
  });
};

// Edit Prices utils
export const getPrices = async (pricesQuantity = 5) =>
  axiosInstance
    .get<ApiRouteResponse<PricesObject>>(GET_PRICES_API, {
      params: { pricesQuantity },
    })
    .then(({ data }) => data.value);

export const updatePrices = async (prices: PricesObject) =>
  axiosInstance.post<ApiRouteResponse<PricesObject>>(GET_PRICES_API, {
    prices,
  });

// Youtube utils
export const getYoutubeData = async () => {
  const data = await axiosInstance.get<ApiRouteResponse<YoutubeData>>(
    GET_YOUTUBE_STATS_API
  );
  const { value } = data.data;
  return value;
};

export const getYoutubeVideoIdFromUrl = (url: string) =>
  url.split("v=")[1] || "";

export const getVideoDuration = async (videoUrl: string) => {
  const videoId = getYoutubeVideoIdFromUrl(videoUrl);
  const response = await axiosInstance.get<ApiRouteResponse<string>>(
    GET_VIDEO_DURATION_API,
    {
      params: {
        videoId,
      },
    }
  );
  const { value } = response.data;
  return value;
};

export const getYoutubeVideoThumnail = (videoId: string) =>
  `https://i3.ytimg.com/vi/${getYoutubeVideoIdFromUrl(videoId)}/hqdefault.jpg`;

export const getFormattedVideoDuration = (duration: string) => {
  let total = "";
  const hours = duration.match(/(\d+)H/);
  const minutes = duration.match(/(\d+)M/);
  const seconds = duration.match(/(\d+)S/);
  if (hours && hours[1])
    total += numberToStringWithLeadingZeroes(parseInt(hours[1])) + ":";
  if (minutes && minutes[1])
    total += numberToStringWithLeadingZeroes(parseInt(minutes[1])) + ":";
  if (seconds && seconds[1])
    total += numberToStringWithLeadingZeroes(parseInt(seconds[1]));
  return total;
};

// Contact form utils
export const sendEmail = <T extends boolean>(
  isContact: T,
  mailFields: MailData<T>
) => {
  return axiosInstance.post(SEND_EMAIL_API, { isContact, mailFields });
};

export const sendErrorEmail = (mailFields: SendMailOptions) => {
  return axiosInstance.post(SEND_ERROR_EMAIL_API, mailFields);
};

export const getMailtoTextPostPurchase = (beatId: string) =>
  `mailto:${
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || ""
  }?subject=Compra de beat ${beatId}!&body=Hice una compra de el beat ${beatId} pero no recibi aun el mail con los archivos."`;

// Checkouts utils
export const getCheckoutLink = async (data: CheckoutBody) => {
  const response = await axiosInstance.post(MP_CHECKOUT_API, data);
  return response.data as { checkoutLink: string };
};

export const revalidateBeatPage = async (beatId: string) => {
  await axiosInstance.get(REVALIDATE_BEAT_PAGE_API, {
    params: {
      beatId,
      secret: process.env.REVALIDATE_SECRET,
    },
  });
};

// Error handling utils
//error handler for any prism error
export const handleDBError = (e: unknown, res: NextApiResponse) => {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      return res.status(500).send({
        message:
          "Ya existe un beat con el mismo nombre o la misma url de YouTube.",
      });
    } else {
      res.status(500).send({ message: e.message });
    }
  }
  res
    .status(500)
    .send({ message: `Internal server error. ${JSON.stringify(e)}` });
  throw e;
};
