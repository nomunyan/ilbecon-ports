import Provider, { ProviderResult } from "./index";
import { ipcRenderer } from "electron";

export default {
  re: null,
  name: "local",
  async getData(path): Promise<ProviderResult> {
    const fileList: string[] = ipcRenderer.sendSync("read-dir", path);
    const title = path.split("/").pop();
    return {
      images: fileList.map((file) => ({
        url: file,
        filename: file.split("/").pop(),
      })),
      title,
      author: "",
      tags: title.split(/[\s.,]+/i),
      source: "",
    };
  },
} as Provider;
