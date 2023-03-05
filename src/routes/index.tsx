export const HOME_PATH = "/";
export const TRACK_LIST_PATH = "/track-list";
export const CONTACT_PATH = "/contact";
export const POST_PURCHASE_PATH = "/post-purchase";
export const BEAT_PATH = "/beat/[beatId]";
export const ADMIN_PATH = "/admin";
export const ADMIN_SIGNIN_PATH = "/admin/signin";

// API Routes
export const BEATS_API = "/api/beat";
export const GET_PRICES_API = "/api/prices";
export const SEARCH_BEATS_API = "/api/search-beats";
export const GET_TAGS_API = "/api/get-tags";
export const GET_YOUTUBE_STATS_API = "/api/get-youtube-stats";
export const SEND_EMAIL_API = "/api/send-email";
export const SEND_ERROR_EMAIL_API = "/api/send-error-email";
export const MP_CHECKOUT_API = "/api/checkout";
export const REVALIDATE_BEAT_PAGE_API = "/api/revalidate";

export const GET_VIDEO_DURATION_API = "/api/get-video-duration";
export const YOUTUBE_STATS_API = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${
  process.env.NEXT_PUBLIC_YT_CHANNEL_ID || ""
}&key=${process.env.YOUTUBE_API_KEY || ""}`;
export const YOUTUBE_THUMBNAIL_API = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${
  process.env.NEXT_PUBLIC_YT_CHANNEL_ID || ""
}&fields=items%2Fsnippet%2Fthumbnails&key=${process.env.YOUTUBE_API_KEY || ""}`;
export const YOUTUBE_VIDEO_DATA_API = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=${
  process.env.YOUTUBE_API_KEY || ""
}&id=`;
