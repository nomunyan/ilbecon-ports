import Provider, { ProviderResult } from "./index";
import { ipcRenderer } from "electron";

export default {
  re: /https?:\/\/www\.ilbe\.com\/view\/(\d*)/i,
  name: "일베글",
  async getData(link: string): Promise<ProviderResult> {
    const data = ipcRenderer.sendSync("fetch", link);
    const metaMatch = data.match(
      /<div class="post-wrap">.*?<h3><a href="javascript:;" onclick="location\.reload\(\);" {2}>(?<title>.*?)<\/a>.*?<span class="global-nick nick">.*?">(?<author>.*?)</s
    );
    const imgMatches = [
      ...data.matchAll(
        /<li><a href="\/file\/download\/(?<image>.*?)" target="_blank">(?<filename>.*) \(/gi
      ),
    ];
    return {
      images: imgMatches.map((m) => ({
        url: `https://www.ilbe.com/file/download/${m.groups.image}`,
        filename: m.groups.filename,
      })),
      title: metaMatch.groups.title,
      author: metaMatch.groups.author,
      tags: metaMatch.groups.title.split(/[\s.,]+/i),
      source: link,
    };
  },
} as Provider;
