import SuyongsoProvider from "./SuyongsoProvider";
import IlbeProvider from "./IlbeProvider";

const providers = [IlbeProvider, SuyongsoProvider];

export default interface Provider {
  readonly re: RegExp;
  readonly name: string;
  getData(link: string): Promise<ProviderResult>;
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
}

export function getProvider(link: string): Provider {
  return providers.find((val) => val.re.test(link));
}
