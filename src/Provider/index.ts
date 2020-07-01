import SuyongsoProvider from "./SuyongsoProvider";

const providers = [SuyongsoProvider];

export default interface Provider {
  readonly re: RegExp;
  readonly name: string;
  getData(link: string): ProviderResult[];
}

export interface ProviderResult {
  readonly image: string;
}

export function getProvider(link: string): Provider {
  return providers.find((val) => val.re.test(link));
}
