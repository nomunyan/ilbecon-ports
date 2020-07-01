import Provider, { ProviderResult } from "./index";

export default {
  re: /https?:\/\/www\.ilbe\.com\/view\/(\d*)/i,
  name: "일베글",
  getData: (): ProviderResult[] => {
    return [];
  },
} as Provider;
