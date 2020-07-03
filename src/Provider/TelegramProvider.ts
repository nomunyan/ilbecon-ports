import Provider, { ProviderResult } from "./index";
import { ipcRenderer } from "electron";

export default {
  re: /^https?:\/\/tlgrm\.eu\/stickers\/.*/i,
  name: "텔레그램 스티커",
  async getData(url): Promise<ProviderResult> {
    const data = ipcRenderer.sendSync("fetch", { method: "GET", url });
    const metaMatch = data.match(
      /object-id="(?<id>(?<path0>.{3})(?<path1>.{3}).*)".*?username="(?<title>.*?)".*?count="(?<count>.*?)".*?"stickerpack-author__name".*?>(?<author>.*?)</is
    );
    return {
      images: [...Array(Number.parseInt(metaMatch.groups.count)).keys()].map(
        (_, i) => ({
          url: `https://s.tcdn.co/${metaMatch.groups.path0}/${
            metaMatch.groups.path1
          }/${metaMatch.groups.id}/192/${i + 1}.png`,
          filename: `${i + 1}.png`,
        })
      ),
      title: metaMatch.groups.title,
      author: metaMatch.groups.author.trim(),
      tags: metaMatch.groups.title.split(/[\s.,]+/i),
      source: url,
    };
  },
} as Provider;
