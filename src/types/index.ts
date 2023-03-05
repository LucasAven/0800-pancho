import type { Beat, File } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";

export interface ISVGProps {
  width: number;
  height: number;
  className?: string;
}

export type LicenseType = "basic" | "premium" | "custom";

export type PricesObject = Record<LicenseType, number>;

export type LicensePerksDescription = {
  license: LicenseType;
  title: string;
  description?: string;
  perks: string[];
  instantDelivery: boolean;
};

export type SelectorOption = {
  value: string;
  label: string;
  disabled?: boolean;
  isSelected?: boolean;
};

export interface ISelectorProps {
  options: SelectorOption[];
  loading?: boolean;
  onSelect: (option: SelectorOption) => void;
  manualSetOption?: SelectorOption;
  placeholder: string;
  noOptionsMessage?: string;
  canSearch?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

export type BeatData = {
  id: number;
  beatId: string;
  id_video: string;
  searchTitle: string;
  image_url: string;
  video_url: string;
  title: string;
  tag: string;
  bpm: string;
  duration: string;
  scale: string;
  sold: boolean;
};

export type BeatEditable = Omit<Beat, "duration" | "id_video" | "searchTitle"> &
  File;

export interface PlayerContextProps {
  beatClicked: BeatData | null;
  beatsList: BeatData[];
  showPlayer: boolean;
  setShowPlayer: Dispatch<SetStateAction<boolean>>;
  setBeatClicked: Dispatch<SetStateAction<BeatData | null>>;
  setBeatsList: Dispatch<SetStateAction<BeatData[]>>;
}

export interface YoutubeData {
  videoCount: string;
  viewCount: string;
  subscriberCount?: string;
  thumbnail: {
    height: number;
    url: string;
    width: number;
  };
}

export type ApiRouteResponse<T> = {
  value?: T;
  message?: string;
};

export type MailData<T> =  T extends true
  ? MailDataContact
  : MailDataBeat;

export interface MailDataContact {
  email: string;
  name: string;
  subject: string;
  message: string;
}

export interface MailDataBeat {
  email: string;
  beat: string;
  id: string;
  collector_id: string;
  link: string;
  license: string;
}

export type CheckoutBody = {
  beat: BeatData;
  license: LicenseType;
  prices: PricesObject;
  buyerEmail: string;
};

export type MPExternalReference = {
  beatId: string;
  email: string;
  license: LicenseType;
};

export type MPPaymentDataResponse = {
  id: number;
  external_reference: string;
  status: "approved" | "rejected";
  collector_id: string;
  status_detail: string;
};

export class UpdateBeatError extends Error {
  errorType: "Payment not approved" | "Beat not found" | "Beat files not found";
  buyerEmail: string;
  transactionId: number;
  collectorId: string;
  beatId: string;
  license: LicenseType;

  constructor(errorInfo: {
    errorType:
      | "Payment not approved"
      | "Beat not found"
      | "Beat files not found";
    buyerEmail: string;
    transactionId: number;
    collectorId: string;
    beatId: string;
    license: LicenseType;
  }) {
    super(errorInfo.errorType);
    this.errorType = errorInfo.errorType;
    this.buyerEmail = errorInfo.buyerEmail;
    this.transactionId = errorInfo.transactionId;
    this.collectorId = errorInfo.collectorId;
    this.beatId = errorInfo.beatId;
    this.license = errorInfo.license;
  }
}
