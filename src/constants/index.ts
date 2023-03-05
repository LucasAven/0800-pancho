import type {
  LicensePerksDescription,
  LicenseType,
  SelectorOption,
  YoutubeData,
} from "types";

// General constants
export const LUCAS_PORTFOLIO_URL = "https://lucas-avendano.netlify.app/";
export const BEATS_MAIN_PAGE = 5;
export const BEATS_PER_PAGE = 12;

// Money constants
export const DOLLARS_API_URL = "https://api.bluelytics.com.ar/v2/latest";
export const DEFAULT_DOLLAR_VALUE = Number(
  process.env.NEXT_PUBLIC_DEFAULT_DOLLAR_VALUE
);

// Files constants
export const IMAGE_PLACEHOLDER = "/image_placeholder.png";
export const YOUTUBE_PROFILE_PICTURE = "/pancho_profile_logo.png";
export const YOUTUBE_VISUALIZATIONS_ICON = "/visualizacion.svg";
export const YOUTUBE_VIDEOS_ICON = "/videos.svg";

// Social Media constants
export const BACKUP_YOUTUBE_STATS: YoutubeData = {
  videoCount: "219",
  viewCount: "108344",
  thumbnail: {
    url: YOUTUBE_PROFILE_PICTURE,
    width: 88,
    height: 88,
  },
};
export const INSTAGRAM_URL = "https://www.instagram.com/0800pancho_";
export const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/channel/${process.env.NEXT_PUBLIC_YT_CHANNEL_ID || ""}`;
// Licenses constants
export const BASIC_LICENSE_PERKS: LicensePerksDescription = {
  license: "basic",
  title: "licencia básica",
  perks: [
    "Archivo WAV y MP3",
    "Sin Tag o marca de agua",
    "Conservas el 100% de las regalías",
    "Distribución libre en cualquier plataforma",
  ],
  instantDelivery: true,
};

export const PREMIUM_LICENSE_PERKS: LicensePerksDescription = {
  license: "premium",
  title: "licencia premium",
  perks: [
    ...BASIC_LICENSE_PERKS.perks,
    "Entrega de archivos Stems del Beat (todos los sonidos utilizados por separado)",
  ],
  instantDelivery: true,
};

export const CUSTOM_LICENSE_PERKS: LicensePerksDescription = {
  license: "custom",
  title: "beat personalizado",
  description:
    "Creacion de un beat a gusto, nos ponemos en contacto y llegamos al resultado deseado.",
  perks: [
    ...PREMIUM_LICENSE_PERKS.perks,
    "Podes enviar tu beat o canción de referencia",
  ],
  instantDelivery: false,
};

export const LICENSES_PERKS: Record<LicenseType, LicensePerksDescription> = {
  basic: BASIC_LICENSE_PERKS,
  premium: PREMIUM_LICENSE_PERKS,
  custom: CUSTOM_LICENSE_PERKS,
};

// Purchase constants
export const BUYABLE_LICENSES_OPTIONS: SelectorOption[] = Object.entries(
  LICENSES_PERKS
)
  .map(([licenseType]) => {
    return {
      label: licenseType.toUpperCase(),
      value: licenseType,
    };
  })
  .filter((license) => license.value !== "custom");

export const PURCHASE_TEXTS = {
  succeded: {
    title: "Compra completada exitosamente 🔥",
    description:
      "Recibirás tus archivos en un instante al mail que hayas proporcionado. Revisa la casilla de spam ya que puede aparacer allí.",
  },
  failed: {
    title: "La compra no se pudo completar 🚫",
    description: "Por favor, intentalo nuevamente.",
  },
} as const;

// Query keys constants
export const SEARCH_BEATS_KEY = "searchBeats";
export const GET_DOLLAR_VALUE_KEY = "getDollarValue";
export const GET_PRICES_KEY = "getPrices";
export const GET_TAGS_KEY = "getTags";
export const GET_YOUTUBE_DATA_KEY = "getYoutubeData";
