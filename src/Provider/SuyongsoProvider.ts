import Provider, { ProviderResult } from "./index";

export default {
  re: /https?:\/\/suyong\.so\/index\.php\?mid=.*(?:&|$)sticker_srl=(.*)(?:&|$)/i,
  name: "수흥콘",
  getData: (): ProviderResult[] => {
    return [];
  },
} as Provider;
