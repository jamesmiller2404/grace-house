export type HeaderIconName =
  | "facebook"
  | "instagram"
  | "youtube"
  | "x"
  | "linkedin"
  | "tiktok"
  | "phone"
  | "mail"
  | "location"
  | "clock"
  | "heart"
  | "info";

export type HeaderTopBarIcon = {
  icon: HeaderIconName;
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type HeaderTopBarButton = {
  label: string;
  href: string;
  bgColor: string;
  textColor: string;
  openInNewTab?: boolean;
};

export type HeaderTopBarContent = {
  enabled: boolean;
  backgroundColor: string;
  textColor: string;
  content?: unknown;
  phone?: string;
  icons: HeaderTopBarIcon[];
  buttons: HeaderTopBarButton[];
};

export const headerTopBarDefaults: HeaderTopBarContent = {
  enabled: true,
  backgroundColor: "#624e92",
  textColor: "#110d17",
  content: undefined,
  phone: "",
  icons: [],
  buttons: [
    {
      label: "GET HELP",
      href: "/get-help",
      bgColor: "#9e5640",
      textColor: "#ffffff",
      openInNewTab: false,
    },
    {
      label: "DONATE",
      href: "/support",
      bgColor: "#e3a857",
      textColor: "#242725",
      openInNewTab: false,
    },
  ],
};
