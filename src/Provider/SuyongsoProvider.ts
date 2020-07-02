import Provider, { ProviderResult } from "./index";
import { ipcRenderer } from "electron";

export default {
  re: /^https?:\/\/suyong\.so\/index\.php\?mid=.*(?:&|$)sticker_srl=(.*)(?:&|$)/i,
  name: "수흥콘",
  async getData(link): Promise<ProviderResult> {
    const data = ipcRenderer.sendSync("fetch", link);
    const metaMatch = data.match(
      /https?:\/\/suyong\.so\/index\.php\?mid=sticker&amp;sticker_srl=\d*">(?<title>.*?)<.*?<div class="btm_area clear">.*?\/>(?<author>.*?)</s
    );
    const imgMatches = [
      ...data.matchAll(
        /<div class="stk_img_v stk_file_.*?<img src="(?<image>.*?)"/gis
      ),
    ];
    return {
      images: imgMatches.map((m) => ({
        url: `https://suyong.so${m.groups.image}`,
        filename: m.groups.image.split("/").pop(),
      })),
      title: metaMatch.groups.title,
      author: metaMatch.groups.author,
      tags: metaMatch.groups.title.split(/[\s.,]+/i),
      source: link,
    };
  },
} as Provider;
