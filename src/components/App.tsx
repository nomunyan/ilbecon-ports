import React, { useState } from "react";
import Provider, { getProvider, ProviderResult } from "../Provider";
import FirstPage from "./FirstPage";
import UploadingPage from "./UploadingPage";

export default function App(): JSX.Element {
  const [page, setPage] = useState<number>(0);
  const [provider, setProvider] = useState<Provider>(undefined);
  const [url, setUrl] = useState<string>();

  const change = (
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    const provider = getProvider(newValue);
    setProvider(undefined);
    if (provider) {
      setUrl(newValue);
      setProvider(provider);
    }
  };
  const uploadCancel = (): void => {
    setPage(0);
    setProvider(undefined);
  };
  const uploadSuccess = (result: ProviderResult): void => {
    console.log(result);
    setPage(2);
  };

  switch (page) {
    case 0:
      return (
        <FirstPage
          provider={provider}
          onChange={change}
          onNext={(): void => setPage(1)}
        />
      );
    case 1:
      return (
        <UploadingPage
          provider={provider}
          url={url}
          onCancel={uploadCancel}
          onSuccess={uploadSuccess}
        />
      );
    case 2:
      return <div>success</div>;
  }
}
