import SuyongsoProvider from "./SuyongsoProvider";
import IlbeProvider from "./IlbeProvider";
import DCProvider from "./DCProvider";

const providers = [IlbeProvider, SuyongsoProvider, DCProvider];

export default interface Provider {
  readonly re: RegExp;
  readonly name: string;
  getData(url: string): Promise<ProviderResult>;
}

export interface ProviderResult {
  readonly images: ImgData[];
  readonly title: string;
  readonly tags: string[];
  readonly author: string;
  readonly source: string;
}

export interface ImgData {
  url: string;
  filename: string;
  referer?: string;
}

export function getProvider(link: string): Provider {
  return providers.find((val) => val.re.test(link));
}
