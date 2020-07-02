import Provider, { ProviderResult } from "./index";

export default {
  re: /https?:\/\/suyong\.so\/index\.php\?mid=.*(?:&|$)sticker_srl=(.*)(?:&|$)/i,
  name: "수흥콘",
  async getData(): Promise<ProviderResult> {
    return { images: [], title: null, tags: [], source: null, author: null };
  },
} as Provider;
