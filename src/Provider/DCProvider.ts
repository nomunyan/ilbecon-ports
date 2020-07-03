import Provider, { ProviderResult } from "./index";
import { ipcRenderer } from "electron";

const DCProvider: Provider = {
  re: /^https?:\/\/dccon\.dcinside\.com\/.*?#(\d*)/i,
  name: "디시콘",
  async getData(link: string): Promise<ProviderResult> {
    const data = `package_idx=${link.match(DCProvider.re)[1]}`;
    const body = ipcRenderer.sendSync("fetch", {
      method: "POST",
      url: `https://dccon.dcinside.com/index/package_detail`,
      data,
      headers: {
        "Content-Length": data.length,
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });
    return {
      images: body.detail.map(
        (dccon: { path: string; sort: string; ext: string }) => ({
          url: `https://dcimg5.dcinside.com/dccon.php?no=${dccon.path}`,
          filename: `${dccon.sort}.${dccon.ext}`,
          referer: "https://www.dcinside.com/",
        })
      ),
      title: body.info.title,
      author: body.info.seller_name,
      tags: body.tags.map((el: { tag: string }) => el.tag),
      source: link,
    };
  },
};
export default DCProvider;
